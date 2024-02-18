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
  VideoResultWithTranscript,
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
import { sendEmail } from "../lib/sendEmail";
import { TranscriptClipWithScore } from "shared/src/manual/TranscriptClip";
import { ArticleSnippetWithScore } from "shared/src/manual/ArticleSnippet";
import { chunksToClips } from "cli/src/recommender/chunksToClips";
import { format } from "path";

type QueryWithSearchResultWithTranscript = {
  searchResults: (VideoResultWithTranscript | MetaphorArticleResult)[];
  query: string;
  questions: string[];
};

type YouTubeRAGInput = RAGInput & { metadata: YTMetadata };
type ArticleRAGInput = RAGInput & { metadata: HighlightMetadata };

export const twitterPipeline = new Saga(
  "twitter-pipeline-v1",
  z.object({
    runId: z.string(),
    username: z.string(),
    summary: z.string().optional(),
    queries: z.string().array().optional(),
    skipUserCheck: z.boolean().optional(),
    enableOpenPipeLogging: z.boolean().optional(),
    emailResults: z.boolean().optional(),
  }),
  {
    async beforeEnqueueStage(initialPayload, step, helpers) {
      helpers.logInfo(`Beginning step ${step.name}`);
      const pipeline = (await prisma.pipelineRun.findUnique({
        where: {
          jobKeyId: initialPayload.runId,
        },
      }))!;

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
  }
)
  .addStep({
    name: "get-user",
    run: async (initialPayload, priorResults, helpers) => {
      const { username } = initialPayload;
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user && !initialPayload.skipUserCheck) {
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
        helpers.logDebug(initialPayload.summary);
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
              n_tweets: 200,
              since_id: lastSavedTweet?.tweetId,
            }),
          helpers.logger
        )
      ).slice(0, 300);

      if (tweets.length < 300 && lastSavedTweet) {
        const moreTweets = await getSavedTweetsForUser({
          username: initialPayload.username,
          before: lastSavedTweet.tweetedAt.toISOString(),
          limit: 300 - tweets.length,
        });
        tweets.push(...moreTweets.map((x) => x.data));
      }

      if (!tweets.length) {
        helpers.logInfo("No tweets fetched");
      } else {
        helpers.logInfo(`${tweets.length} tweets fetched successfully`);
      }
      return { tweets };
    },
  })
  .addStep({
    name: "summarize-tweets",
    run: async (initialPayload, priorResults, helpers) => {
      const { username } = initialPayload;
      helpers.logInfo(`Summarizing tweets for Twitter user @${username}`);
      const api = getTwitterAPISingleton();
      const twitterUser = await getUserProfile(api, username);
      if (initialPayload.summary) {
        helpers.logInfo("Using existing summary, skipping summary");
        helpers.logDebug(initialPayload.summary);
        return {
          profile: initialPayload.summary,
          twitterUser,
        };
      }

      const profile = await recursivelySummarizeTweets().execute({
        user: twitterUser,
        tweets: priorResults["get-tweets"].tweets,
        enableOpenPipeLogging: initialPayload.enableOpenPipeLogging,
      });

      if (!profile) {
        helpers.logInfo("Failed to summarize tweets");
        throw new Error("Failed to summarize tweets");
      } else {
        helpers.logInfo("Tweets summarized successfully");
        helpers.logDebug(profile);
        return {
          profile,
        };
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
          enableOpenPipeLogging: initialPayload.enableOpenPipeLogging,
          openPipeRequestTags: createRequestTags({
            runId: initialPayload.runId,
            user: initialPayload.username,
          }),
          profile: priorResults["summarize-tweets"].profile,
          bio:
            priorResults["summarize-tweets"].twitterUser?.rawDescription || "",
          user: initialPayload.username,
        });
        queries.push(...res.queries);
      }
      const queriesWithQuestions = await pAll(
        queries.map((query) => async () => {
          const questions = await brainstormQuestions().execute({
            query,
            enableOpenPipeLogging: initialPayload.enableOpenPipeLogging,
            openPipeRequestTags: createRequestTags({
              runId: initialPayload.runId,
              user: initialPayload.username,
            }),
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
        { concurrency: 2 }
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
              const { id, title } = result;
              const fetchResult = await yt.transcript.fetch({ id, title });
              if (!fetchResult || !fetchResult.cues.length) {
                console.log("Skipping video without transcript");
                return;
              }
              return {
                ...result,
                transcript: fetchResult,
              };
            }),
            { concurrency: 3 }
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
                    results.searchResults.flatMap((result) =>
                      chunkTranscript(
                        (result as VideoResultWithTranscript).transcript
                      )
                    )
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

      const clips = chunksToClips({
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
    run: async (initialPayload, priorResults, helpers) => {
      const { clips } = priorResults["rag"];
      const { queriesWithQuestions } = priorResults["create-queries-metaphor"];
      helpers.logInfo("Cleaning clips...");
      const tasks = Object.entries(clips).flatMap(([question, clips]) => {
        return clips.flatMap((clip) => async () => {
          if (clip.type === "article") {
            const result = await findStartOfAnswer().execute({
              question,
              text: clip.text,
            });
            if (result?.quotedAnswer) {
              const match = nearestSubstring(result.quotedAnswer, clip.text);
              if (match.bestMatch && match.bestScore > 0.8) {
                return {
                  ...clip,
                  text: clip.text.slice(match.bestStartIdx),
                };
              }
              return clip;
            }
            return null;
          } else {
            const result = await findStartOfAnswerYouTube().execute({
              question,
              cues: clip.cues,
            });
            if (result?.cueId != null) {
              const newCues = clip.cues.slice(result.cueId);
              return {
                ...clip,
                start: newCues[0].start,
                cues: newCues,
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
        const formatEmail = () => {
          let str = ``;
          for (const [query, clusters] of Object.entries(finalData.clips)) {
            str += `<h3>${query}</h3>`;
            for (const [question, clips] of Object.entries(clusters)) {
              str += `<h4>${question}</h4>`;
              str += `<ul>`;
              for (const clip of clips) {
                str += `<li href="${
                  clip.type === "article" ? clip.articleUrl : clip.videoUrl
                }">${clip.title}</li>`;
              }
              str += `</ul>`;
            }
          }
        };

        await sendEmail(
          user,
          "Your latest recommendations are ready!",
          `
Hi ${user.name},

Your latest recommendations are ready. You can also view them <a href="https://open-recommender.com/#/user/experilearning/feed">here</a>.

${formatEmail()}

Best,

<a href="https://twitter.com/experilearning">James</a>
`.trim()
        );
        helpers.logInfo("Email sent");
      }
    },
  });
