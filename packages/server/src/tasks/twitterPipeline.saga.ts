import { z } from "zod";
import { Saga } from "./saga";
import { prisma } from "../db";
import { getSavedTweetsForUser } from "../lib/tweets";
import { twitter } from "cli/src/twitter";
import { yt } from "cli/src/youtube";
import { withPerformanceMeasure } from "./perf";
import { getTwitterAPISingleton } from "../lib/twitter";
import { getUserProfile } from "cli/src/twitter/getUserContext";
import { recursivelySummarizeTweets } from "cli/src/recommender/prompts/recursiveTwitterSummarizer/recursiveTwitterSummarizer";
import { createQueriesFromProfile } from "cli/src/recommender/prompts/createQueriesFromProfile/createQueriesFromProfile";
import { createRequestTags } from "cli/src/openpipe/requestTags";
import { brainstormQuestions } from "cli/src/recommender/prompts/brainstormSubQuestions/brainstormQuestions";
import { pAll } from "cli/src/utils/pAll";
import {
  MetaphorArticleResult,
  VideoResultWithTranscriptFile,
  searchNonYouTube,
  searchYouTube,
} from "cli/src/metaphor/search";
import { compact } from "remeda";
import {
  HighlightMetadata,
  RAGInput,
  YTMetadata,
  chunkTranscript,
  searchChunks,
} from "cli/src/rag/rag";
import { findStartOfAnswer } from "cli/src/recommender/prompts/findStartOfAnswer/findStartOfAnswer";
import { nearestSubstring } from "cli/src/metaphor/nearestSubstring";
import { findStartOfAnswerYouTube } from "cli/src/recommender/prompts/findStartOfAnswerYouTube/findStartOfAnswerYouTube";
import { uniqBy } from "remeda";
import { addRecommendations } from "../lib/addRecomendations";
import { sendRecommendationsEmail } from "../lib/sendEmail";
import { TranscriptClipWithScore } from "shared/src/manual/TranscriptClip";
import { ArticleSnippetWithScore } from "shared/src/manual/ArticleSnippet";
import { chunksToClips } from "cli/src/recommender/chunksToClips";
import { titleClip } from "cli/src/recommender/prompts/titleClip/titleClip";
import { answersQuestion } from "cli/src/recommender/prompts/answersQuestion/answersQuestion";
import { DefaultRun } from "modelfusion";
import {
  OpenAICostCalculator,
  calculateCost,
} from "@modelfusion/cost-calculator";

type QueryWithSearchResultWithTranscript = {
  searchResults: (VideoResultWithTranscriptFile | MetaphorArticleResult)[];
  query: string;
  questions: string[];
};

type YouTubeRAGInput = RAGInput & { metadata: YTMetadata };
type ArticleRAGInput = RAGInput & { metadata: HighlightMetadata };

const MAX_TWEETS = 120;

export const twitterPipeline = new Saga(
  "twitter-pipeline-v1",
  z.object({
    runId: z.string(),
    username: z.string(),
    summary: z.number().optional(),
    queries: z.string().array().optional(),
    enableOpenPipeLogging: z.boolean().optional(),
    emailResults: z.boolean().optional(),
  }),
  {
    async beforeEnqueueStage(initialPayload, step, helpers) {
      helpers.logInfo(`Beginning step ${step.name}`);
      const pipeline = await prisma.pipelineRun.findUnique({
        where: {
          jobKeyId: initialPayload.runId,
        },
      });
      if (!pipeline) {
        throw new Error("Pipeline not found");
      }

      const existingTask = await prisma.pipelineTask.findFirst({
        where: {
          jobId: helpers.job.id,
          pipelineRunId: pipeline?.id,
        },
      });

      if (!existingTask) {
        await prisma.pipelineTask.create({
          data: {
            jobId: helpers.job.id,
            pipelineRunId: pipeline?.id,
            name: step.name,
            status: "running",
          },
        });
      } else {
        await prisma.pipelineTask.update({
          where: {
            id: existingTask.id,
          },
          data: {
            status: "running",
          },
        });
      }
    },
    async afterStage(initialPayload, step, helpers) {
      const pipeline = await prisma.pipelineRun.findUnique({
        where: {
          jobKeyId: initialPayload.runId,
        },
      });

      const existingTask = await prisma.pipelineTask.findFirst({
        where: {
          jobId: helpers.job.id,
          pipelineRunId: pipeline?.id,
        },
      });

      const cost = await calculateCost({
        calls: helpers.run.getSuccessfulModelCalls(),
        costCalculators: [new OpenAICostCalculator()],
      });

      if (existingTask && pipeline) {
        await prisma.pipelineTask.update({
          where: {
            id: existingTask.id,
            pipelineRunId: pipeline?.id,
          },
          data: {
            costInMillicents:
              (existingTask.costInMillicents || 0) + cost.costInMillicents,
          },
        });
      }
    },
  }
)
  .addStep({
    name: "get-user",
    run: async (initialPayload, priorResults, helpers) => {
      const { username } = initialPayload;
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user) {
        throw new Error("User not found");
      }
      helpers.logInfo(`Creating recommendations for Twitter user @${username}`);
      return { user };
    },
  })
  .addStep({
    name: "get-tweets",
    run: async (initialPayload, priorResults, helpers) => {
      const { user } = priorResults["get-user"];
      if (initialPayload.summary) {
        helpers.logInfo("Using existing summary, skipping get-tweets step");
        return { tweets: [] };
      } else if (initialPayload.queries) {
        helpers.logInfo("Using custom queries, skipping get-tweets step");
        helpers.logDebug(JSON.stringify(initialPayload.queries, null, 2));
        return { tweets: [] };
      }

      const lastSavedTweet = user
        ? (
            await getSavedTweetsForUser({
              username: user.username,
              limit: 1,
            })
          )[0]
        : undefined;

      const tweets = (
        await withPerformanceMeasure(
          "fetch-tweets",
          () =>
            twitter.tweets.fetch({
              user: initialPayload.username,
              n_tweets: MAX_TWEETS,
              since_id: lastSavedTweet?.tweetId,
            }),
          helpers.logger
        )
      ).slice(0, MAX_TWEETS);
      helpers.logInfo(`Fetched ${tweets.length} new tweets from Twitter`);
      const reuseExistingSummary = tweets.length === 0;
      helpers.logInfo(`Reuse existing summary: ${reuseExistingSummary}`);

      if (tweets.length < MAX_TWEETS && lastSavedTweet) {
        const moreTweets = await getSavedTweetsForUser({
          username: initialPayload.username,
          before: lastSavedTweet.tweetedAt.toISOString(),
          limit: MAX_TWEETS - tweets.length,
        });
        helpers.logInfo(`Fetched ${moreTweets.length} saved tweets from DB`);
        tweets.push(...moreTweets.map((x) => x.data));
      }

      if (!tweets.length) {
        helpers.logInfo("No tweets fetched");
      } else {
        helpers.logInfo(`${tweets.length} tweets fetched successfully`);
      }
      return { tweets, reuseExistingSummary };
    },
  })
  .addStep({
    name: "summarize-tweets",
    maxAttempts: 3,
    run: async (initialPayload, priorResults, helpers) => {
      const { username } = initialPayload;
      helpers.logInfo(`Summarizing tweets for Twitter user @${username}`);
      const api = getTwitterAPISingleton();
      const twitterUser = await getUserProfile(api, username);
      if (initialPayload.summary) {
        helpers.logInfo("Using existing summary specified in payload");
        const summary = await prisma.summary.findFirst({
          where: {
            userId: priorResults["get-user"].user?.id,
            id: initialPayload.summary,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        if (summary) {
          return {
            profile: summary,
            twitterUser,
          };
        } else {
          helpers.logInfo(
            "Tried to reuse existing summary from DB, but no existing summary found"
          );
        }
      } else if (initialPayload.queries) {
        helpers.logInfo("Using custom queries, skipping summary");
        return {
          twitterUser,
        };
      }

      if (priorResults["get-tweets"]["reuseExistingSummary"]) {
        const latestSummary = await prisma.summary.findFirst({
          where: {
            userId: priorResults["get-user"].user?.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        if (latestSummary) {
          helpers.logInfo("Reusing latest summary from DB");
          return {
            profile: latestSummary,
          };
        } else {
          helpers.logInfo(
            "Tried to reuse latest summary from DB, but no existing summary found"
          );
        }
      }

      helpers.logInfo("Summarizing tweets...");
      const profile = await recursivelySummarizeTweets().execute({
        user: twitterUser,
        tweets: priorResults["get-tweets"].tweets,
        enableOpenPipeLogging: initialPayload.enableOpenPipeLogging,
        run: helpers.run,
      });

      if (!profile) {
        helpers.logInfo("Failed to summarize tweets");
        throw new Error("Failed to summarize tweets");
      } else {
        helpers.logInfo("Tweets summarized successfully into profile");
        const summary = await prisma.summary.create({
          data: {
            userId: priorResults["get-user"].user?.id,
            content: profile,
            public: true,
          },
        });
        if (!summary) {
          helpers.logInfo("Failed to save summary to DB");
          throw new Error("Failed to save summary to DB");
        } else {
          return {
            profile: summary,
          };
        }
      }
    },
  })
  .addStep({
    name: "create-queries-metaphor",
    run: async (initialPayload, priorResults, helpers) => {
      helpers.logInfo("Creating Metaphor search queries...");
      const queries: string[] = [];
      if (initialPayload.queries) {
        queries.push(...initialPayload.queries);
      } else {
        const res = await createQueriesFromProfile().execute({
          profile: typeof priorResults["summarize-tweets"].profile?.content,
          bio:
            priorResults["summarize-tweets"].twitterUser?.rawDescription || "",
          user: initialPayload.username,
        });
        queries.push(...res.queries);
      }
      const queriesWithQuestions = await pAll(
        queries.map((query) => async () => {
          const questions = await brainstormQuestions().execute({
            run: helpers.run,
            query,
          });
          return {
            query,
            questions,
          };
        }),
        { concurrency: 5 }
      );
      if (!queriesWithQuestions.length) {
        const msg = "No search queries generated";
        throw new Error(msg);
      } else {
        helpers.logInfo(`${queriesWithQuestions.length} queries generated`);
        helpers.logDebug(JSON.stringify(queriesWithQuestions, null, 2));
        helpers.logInfo("Limiting to 5 queries");
        return {
          queriesWithQuestions: queriesWithQuestions.slice(0, 5),
        };
      }
    },
  })
  .addStep({
    name: "search-for-videos",
    run: async (initialPayload, priorResults, helpers) => {
      const { queriesWithQuestions } = priorResults["create-queries-metaphor"];

      helpers.logInfo("Searching YouTube...");

      const youtubeResults = await pAll(
        queriesWithQuestions.map(({ query, questions }) => async () => {
          const results = await yt.search({
            query: query,
            n_results: 20,
          });
          return {
            query,
            questions: [query, ...questions],
            searchResults: results,
          };
        }),
        { concurrency: 4 }
      );

      const metaphorYouTubeResults = await pAll(
        queriesWithQuestions.map(({ query, questions }) => async () => {
          const rawSearchResultsForQuery = await searchYouTube({
            query,
            numResults: 20,
          });
          helpers.logInfo(
            `Found ${rawSearchResultsForQuery.length} results for query "${query}"`
          );
          helpers.logDebug(
            rawSearchResultsForQuery
              .map((result, idx) => `${idx + 1}. ${result.title}`)
              .join("\n")
          );
          return {
            query,
            questions: [query, ...questions],
            searchResults: rawSearchResultsForQuery,
          };
        }),
        { concurrency: 10 }
      );

      const metaphorArticleResults = await pAll(
        queriesWithQuestions.map(({ query, questions }) => async () => {
          const results = await searchNonYouTube({
            query,
            numResults: 20,
          });
          return {
            query,
            questions: [query, ...questions],
            searchResults: results,
          };
        }),
        { concurrency: 2 }
      );
      console.log(
        "all results",
        JSON.stringify({
          metaphorArticleResults,
          metaphorYouTubeResults,
          youtubeResults,
        })
      );

      const all = [
        ...youtubeResults,
        ...metaphorYouTubeResults,
        ...metaphorArticleResults,
      ];
      helpers.logInfo(`Found ${all.length} search results`);
      return { queryWithResults: all };
    },
  })
  .addStep({
    name: "download-transcripts",
    run: async (initialPayload, priorResults, helpers) => {
      const { queryWithResults: searchResults } =
        priorResults["search-for-videos"];
      helpers.logInfo(`Fetching ${searchResults.length} transcripts...`);
      const resultsWithTranscripts: QueryWithSearchResultWithTranscript[] = [];
      for (const results of searchResults) {
        const searchResultsWithTranscripts = compact(
          await pAll(
            results.searchResults.map((result) => async () => {
              if (result.type === "article") {
                return result;
              }
              const { id } = result;
              // avoiding PG error from saving the payload with tons of transcript text
              const fetchResult = await yt.transcript.download({ videoId: id });
              if (!fetchResult) {
                console.log("Skipping video without transcript");
                return;
              }
              return {
                ...result,
                transcriptFile: fetchResult,
              };
            }),
            { concurrency: 5 }
          )
        );
        resultsWithTranscripts.push({
          ...results,
          searchResults: searchResultsWithTranscripts,
        });
      }
      if (!resultsWithTranscripts.length) {
        const msg = "No results left after transcript fetch step";
        helpers.logger.warn(msg);
        throw new Error(msg);
      } else {
        helpers.logInfo(
          resultsWithTranscripts.flatMap((x) => x.searchResults).length +
            " transcripts fetched successfully"
        );
        return { resultsWithTranscripts };
      }
    },
  })
  .addStep({
    name: "rag",
    run: async (initialPayload, priorResults, helpers) => {
      const { resultsWithTranscripts } = priorResults["download-transcripts"];
      const { queriesWithQuestions } = priorResults["create-queries-metaphor"];
      helpers.logInfo(
        `Chunking ${
          resultsWithTranscripts.flatMap((x) => x.searchResults).length
        } transcripts...`
      );
      const chunks: (YouTubeRAGInput | ArticleRAGInput)[] = compact(
        (
          await Promise.all(
            resultsWithTranscripts.flatMap(async (results) => {
              if (results.searchResults.length === 0) {
                return null;
              } else if (results.searchResults[0]?.type === "article") {
                const ragInput = (
                  results.searchResults as MetaphorArticleResult[]
                ).flatMap((result) =>
                  result.highlights.map((highlight) => ({
                    content: highlight.text,
                    metadata: {
                      type: "highlight" as const,
                      articleId: result.id,
                    },
                  }))
                );
                return ragInput;
              } else {
                const ragInput = (
                  await Promise.all(
                    results.searchResults.flatMap(async (result) => {
                      // should be cached on disk
                      const transcript = await yt.transcript.fetch({
                        id: result.id,
                        title: result.title,
                      });
                      return transcript
                        ? await chunkTranscript(transcript)
                        : [];
                    })
                  )
                ).flat();
                return ragInput;
              }
            })
          )
        ).flat()
      );

      const queries = queriesWithQuestions.flatMap((x) => [
        x.query,
        ...x.questions,
      ]);
      helpers.logDebug("Running RAG with queries: " + JSON.stringify(queries));
      const results = await searchChunks<HighlightMetadata | YTMetadata>({
        queries,
        chunks,
        scoreCutOff: 0,
      });

      const clips = await chunksToClips({
        results,
        scoreCutOff: 15,
        searchResults: resultsWithTranscripts.flatMap((x) => x.searchResults),
      });
      if (!clips || !Object.keys(clips).length) {
        const msg = "No clips created";
        helpers.logger.warn(msg);
      } else {
        helpers.logInfo(Object.keys(clips).length + " chunks created");
      }
      return { clips };
    },
  })
  .addStep({
    name: "clean-clips",
    maxAttempts: 3,
    run: async (initialPayload, priorResults, helpers) => {
      const { clips } = priorResults["rag"];
      const { queriesWithQuestions } = priorResults["create-queries-metaphor"];
      helpers.logInfo("Cleaning clips...");
      const tasks = Object.entries(clips).flatMap(([question, clips]) => {
        return clips.flatMap((clip) => async () => {
          const answersQ = await answersQuestion().execute({
            question: clip.question,
            text: clip.text,
            run: helpers.run,
          });
          if (!answersQ.answersQuestion) {
            return null;
          }
          if (clip.type === "article") {
            const quotedAnswer = await findStartOfAnswer().execute({
              question,
              text: clip.text,
              run: helpers.run,
            });
            if (quotedAnswer) {
              const match = nearestSubstring(quotedAnswer, clip.text);
              if (match.bestMatch && match.bestScore > 0.8) {
                const summarizedTitle = await titleClip().execute({
                  clip: clip.text,
                  videoTitle: clip.articleTitle,
                  run: helpers.run,
                  question: clip.question,
                });
                return {
                  ...clip,
                  text: clip.text.slice(match.bestStartIdx),
                  summarizedTitle: summarizedTitle.title,
                };
              }
              return clip;
            }
            return null;
          } else {
            const result = await findStartOfAnswerYouTube().execute({
              question,
              cues: clip.cues,
              run: helpers.run,
            });
            if (result?.cueId != null) {
              const newCues = clip.cues.slice(result.cueId);
              const summarizedTitle = await titleClip().execute({
                clip: clip.text,
                videoTitle: clip.videoTitle,
                question: clip.question,
                run: helpers.run,
              });
              return {
                ...clip,
                start: newCues[0].start,
                cues: newCues,
                summarizedTitle: summarizedTitle.title,
              };
            }
            return null;
          }
        });
      });

      const cleanedClips = uniqBy(
        compact(await pAll(tasks, { concurrency: 10 })),
        (x) => (x.type === "article" ? x.text : x.videoId + x.start)
      );

      const groupedClips: Record<
        string,
        Record<string, (TranscriptClipWithScore | ArticleSnippetWithScore)[]>
      > = {};

      for (const { query, questions } of queriesWithQuestions) {
        groupedClips[query] = {};
        for (const question of [query, ...questions]) {
          if (!groupedClips[query][question]) {
            groupedClips[query][question] = [];
          }
          groupedClips[query][question].push(
            ...cleanedClips.filter((x) => x.question === question)
          );
        }
      }

      if (!cleanedClips.length) {
        const msg = "No clips left after cleaning";
        helpers.logger.warn(msg);
      } else {
        helpers.logInfo(cleanedClips.length + " clips cleaned");
      }
      return { groupedClips };
    },
  })
  .addStep({
    name: "save-results",
    run: async (initialPayload, priorResults, helpers) => {
      const finalData = {
        summary: priorResults["summarize-tweets"].profile,
        clips: priorResults["clean-clips"].groupedClips,
        username: initialPayload.username,
      };
      const user = priorResults["get-user"].user;
      if (user) {
        await addRecommendations({ input: finalData, user });
      } else {
        helpers.logInfo("No user found in DB, skipping save-results step");
      }
      return { finalData };
    },
  })
  .addStep({
    name: "email-results",
    run: async (initialPayload, priorResults, helpers) => {
      const user = priorResults["get-user"].user;
      const { finalData } = priorResults["save-results"];
      const clipsFlat = Object.values(finalData.clips)
        .flatMap((x) => Object.values(x))
        .flat();
      if (
        !initialPayload.emailResults ||
        !user?.email ||
        clipsFlat.length === 0
      ) {
        helpers.logInfo("Skipping email-results step");
        helpers.logDebug(
          JSON.stringify(
            {
              emailResults: initialPayload.emailResults,
              email: user?.email,
            },
            null,
            2
          )
        );
        return;
      } else {
        await sendRecommendationsEmail(user, finalData);
        helpers.logInfo("Email sent");
      }
    },
  })
  .addStep({
    name: "done",
    run: async (_, __, helpers) => {
      helpers.logInfo("Pipeline complete");
    },
  });
