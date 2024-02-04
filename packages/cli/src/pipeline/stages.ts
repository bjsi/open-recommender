import chalk from "chalk";
import { twitter } from "../twitter";
import { Tweet } from "shared/src/manual/Tweet";
import { yt } from "../youtube";
import { Failure, Success, failure, success } from "./run";
import { Transcript, transcriptToString } from "../youtube/transcript";
import { PipelineArgs, pipelineArgsSchema } from "./pipeline";
import { pAll } from "./utils/pAll";
import { createRequestTags } from "../openpipe/requestTags";
import { recursivelySummarizeTweets } from "../recommender/prompts/recursiveTwitterSummarizer/recursiveTwitterSummarizer";
import { createQueriesFromProfile } from "../recommender/prompts/createQueriesFromProfile/createQueriesFromProfile";
import {
  MetaphorArticleResult,
  MetaphorYouTubeResult,
  searchNonYouTube,
  searchYouTube,
} from "../metaphor/search";
import { trpc } from "../trpc";
import {
  ArticleSnippetWithScore,
  HighlightMetadata,
  RAGChunk,
  RAGInput,
  TranscriptClipWithScore,
  YTMetadata,
  chunkTranscript,
  searchChunks,
} from "../rag/rag";
import { brainstormQuestions } from "../recommender/prompts/brainstormSubQuestions/brainstormQuestions";
import { compact, last, uniqBy } from "remeda";
import { getUserProfile } from "../twitter/getUserContext";
import { initTwitterAPI } from "../twitter/twitterAPI";
import { readFileSync, writeFileSync } from "fs";
import { YouTubeResult } from "../youtube/search";
import { youtubeUrlWithTimestamp } from "shared/src/youtube";
import { findStartOfAnswer } from "../recommender/prompts/findStartOfAnswer/findStartOfAnswer";
import { nearestSubstring } from "../metaphor/nearestSubstring";
import { findStartOfAnswerYouTube } from "../recommender/prompts/findStartOfAnswerYouTube/findStartOfAnswerYouTube";

export const STAGES = [
  "validate-args",
  "get-tweets",
  "summarize-tweets",
  "create-queries-metaphor",
  "search-for-videos",
  "download-transcripts",
  "appraise-transcripts",
  "rag",
  "clean-clips",
  "save-results",
] as const;

export const validateArgs = {
  name: "validate-args",
  description: "Validate arguments",
  run: async function (
    args: PipelineArgs
  ): Promise<Success<PipelineArgs> | Failure> {
    const maybeArgs = pipelineArgsSchema.safeParse(args);
    if (!maybeArgs.success) {
      return failure(maybeArgs.error);
    }
    return success(args);
  },
};

interface GetTweetsStageArgs extends PipelineArgs {}

export const getTweets = {
  name: "get-tweets",
  description: "Get tweets from Twitter user",
  run: async function (
    args: GetTweetsStageArgs
  ): Promise<Success<SummarizeTweetsArgs> | Failure> {
    const { user } = args;
    if (args.summary) {
      console.log(chalk.blue("Using existing summary file, skipping tweets"));
      return success({ ...args, tweets: [] });
    }
    const dbUser = await trpc.getUser.query({ username: user });
    if (!dbUser) {
      const msg = "User not found in Open Recommender DB";
      console.log(chalk.red(msg));
      return failure(msg);
    }
    const lastSavedTweet = (
      await trpc.getTweets.query({
        username: user,
        limit: 1,
      })
    )[0];
    console.log(
      chalk.blue(`Creating recommendations for Twitter user @${user}`)
    );

    // get user context

    console.log(chalk.blue("Fetching tweets..."));
    const tweets = (
      await twitter.tweets.fetch({
        user,
        n_tweets: 200,
        since_id: lastSavedTweet?.tweetId,
      })
    ).slice(0, 300);

    if (tweets.length < 300) {
      const moreTweets = await trpc.getTweets.query({
        username: user,
        before: lastSavedTweet?.tweetedAt,
        limit: 300 - tweets.length,
      });
      tweets.push(...moreTweets.map((x) => x.data));
    }

    if (!tweets.length) {
      console.log(chalk.red("No tweets found"));
    } else {
      console.log(chalk.green(tweets.length + " tweets fetched successfully"));
    }
    return success({ ...args, tweets });
  },
};

interface SummarizeTweetsArgs extends GetTweetsStageArgs {
  tweets: Tweet[];
}

export const summarizeTweets = {
  name: "summarize-tweets",
  description: "Summarize tweets",
  run: async function (
    args: SummarizeTweetsArgs
  ): Promise<Success<CreateQueriesStageArgs> | Failure> {
    const { tweets, user } = args;
    console.log(chalk.blue("Summarizing tweets..."));

    const { api, bridge } = initTwitterAPI();
    const twitterUser = await getUserProfile(api, user);
    bridge.close();
    if (args.summary) {
      console.log(chalk.blue("Using existing summary, skipping summary"));
      return success({
        ...args,
        profile: args.summary,
        bio: twitterUser.rawDescription,
      });
    }

    const profile = await recursivelySummarizeTweets().execute({
      user: twitterUser,
      tweets,
    });

    if (!profile) {
      const msg = "Failed to summarize tweets";
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(chalk.blue("Summary:"));
      console.log(profile);
      return success({ ...args, profile, bio: tweets[0].user.rawDescription });
    }
  },
};

interface CreateQueriesStageArgs extends PipelineArgs {
  tweets: Tweet[];
  profile: string;
  bio: string;
}

export const createQueriesMetaphor = {
  name: "create-queries-metaphor",
  description: "Create queries for YouTube search",
  run: async function (
    args: CreateQueriesStageArgs
  ): Promise<Success<SearchForVideosStageArgs> | Failure> {
    const { profile, bio, user } = args;
    console.log(chalk.blue("Creating search queries..."));
    const queries: string[] = [];
    if (args.customQuery) {
      queries.push(args.customQuery);
    } else {
      const res = await createQueriesFromProfile().execute({
        enableOpenPipeLogging: args.enableLogging,
        openPipeRequestTags: createRequestTags(args),
        profile,
        bio,
        user,
      });
      queries.push(...res.queries);
    }
    const queriesWithQuestions = await pAll(
      queries.map((query) => async () => {
        const questions = await brainstormQuestions().execute({
          query,
          enableOpenPipeLogging: args.enableLogging,
          openPipeRequestTags: createRequestTags(args),
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
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(
        chalk.green(queriesWithQuestions.length + " queries generated")
      );
      console.log(chalk.blue("Queries:"));
      console.log(chalk.blue("Limiting to 5 queries:"));
      console.log(JSON.stringify(queriesWithQuestions.slice(0, 5), null, 2));
      return success({
        ...args,
        queriesWithQuestions: queriesWithQuestions.slice(0, 5),
      });
    }
  },
};

interface SearchForVideosStageArgs extends CreateQueriesStageArgs {
  queriesWithQuestions: {
    query: string;
    questions: string[];
  }[];
}

type QueryWithSearchResult = {
  searchResults:
    | MetaphorYouTubeResult[]
    | YouTubeResult[]
    | MetaphorArticleResult[];
  query: string;
  questions: string[];
};

export const searchForVideos = {
  name: "search-for-videos",
  description: "Search for videos on YouTube",
  run: async function (
    args: SearchForVideosStageArgs
  ): Promise<Success<DownloadTranscriptsStageArgs> | Failure> {
    const { queriesWithQuestions } = args;

    console.log(chalk.blue("Searching YouTube..."));

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
        console.log(
          chalk.blue(
            rawSearchResultsForQuery
              .map((result, idx) => `${idx + 1}. ${result.title}`)
              .join("\n")
          )
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
    console.log(chalk.blue("Found " + all.length + " search results"));
    return success({ ...args, queryWithResults: all });
  },
};

type VideoResult = MetaphorYouTubeResult | YouTubeResult;
type VideoResultWithTranscript = VideoResult & { transcript: Transcript };

type QueryWithSearchResultWithTranscript = {
  searchResults: (VideoResultWithTranscript | MetaphorArticleResult)[];
  query: string;
  questions: string[];
};

interface DownloadTranscriptsStageArgs extends SearchForVideosStageArgs {
  queryWithResults: QueryWithSearchResult[];
}

export const downloadTranscripts = {
  name: "download-transcripts",
  description: "Download transcripts for videos",
  run: async function (
    args: DownloadTranscriptsStageArgs
  ): Promise<Success<RAGStageArgs> | Failure> {
    const { queryWithResults: searchResults } = args;
    console.log(chalk.blue(`Fetching ${searchResults.length} transcripts...`));
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
      const msg = "No transcripts fetched";
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(
        chalk.green(
          resultsWithTranscripts.flatMap((x) => x.searchResults).length +
            " transcripts fetched successfully"
        )
      );
      return success({ ...args, resultsWithTranscripts });
    }
  },
};

interface RAGStageArgs extends DownloadTranscriptsStageArgs {
  resultsWithTranscripts: QueryWithSearchResultWithTranscript[];
}

const chunksToClips = (args: {
  results: Record<string, RAGChunk[]>;
  scoreCutOff: number;
  searchResults: (VideoResultWithTranscript | MetaphorArticleResult)[];
}) => {
  const clips: Record<
    string,
    (TranscriptClipWithScore | ArticleSnippetWithScore)[]
  > = {};
  for (const [question, chunks] of Object.entries(args.results)) {
    for (const chunk of chunks) {
      if (chunk.score < args.scoreCutOff) {
        continue;
      }
      const searchResult = args.searchResults.find((searchResult) =>
        chunk.metadata.type === "youtube"
          ? searchResult.type === "youtube" &&
            searchResult.transcript.videoId === chunk.metadata.videoId
          : chunk.metadata.articleId === searchResult.id
      );
      if (!searchResult) {
        console.error("Search result not found for chunk", chunk);
        continue;
      } else if (searchResult.type === "article") {
        const articleHighlight = chunk as RAGChunk & {
          metadata: HighlightMetadata;
        };
        if (!clips[question]) {
          clips[question] = [];
        }
        clips[question].push({
          type: "article",
          title: question,
          question: question,
          text: articleHighlight.content,
          score: chunk.score,
          rank: chunk.rank,
          articleTitle: searchResult.title,
          articleUrl: searchResult.url,
        });
      } else {
        const videoChunk = chunk as RAGChunk & { metadata: YTMetadata };
        const cues = searchResult.transcript.cues.slice(
          videoChunk.metadata.minCueIdx,
          videoChunk.metadata.maxCueIdx
        );
        if (!clips[question]) {
          clips[question] = [];
        }
        clips[question].push({
          type: "youtube",
          title: question,
          question: question,
          start: cues[0].start,
          end: last(cues)!.end,
          videoTitle: searchResult.transcript.videoTitle,
          videoUrl: youtubeUrlWithTimestamp(
            searchResult.transcript.videoId,
            cues[0].start
          ),
          videoId: searchResult.transcript.videoId,
          text: transcriptToString(cues),
          score: chunk.score,
          rank: chunk.rank,
          cues,
        });
      }
    }
  }
  return clips;
};

type YouTubeRAGInput = RAGInput & { metadata: YTMetadata };
type ArticleRAGInput = RAGInput & { metadata: HighlightMetadata };

export const RAGStage = {
  name: "rag",
  description: "RAG Chunk transcripts",
  run: async function (
    args: RAGStageArgs
  ): Promise<Success<CleanClipsStageArgs> | Failure> {
    const { resultsWithTranscripts } = args;
    console.log(
      chalk.blue(
        `Chunking ${
          resultsWithTranscripts.flatMap((x) => x.searchResults).length
        } transcripts...`
      )
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

    const queries = args.queriesWithQuestions.flatMap((x) => [
      x.query,
      ...x.questions,
    ]);
    const results = await searchChunks<HighlightMetadata | YTMetadata>({
      queries,
      chunks,
      scoreCutOff: 0,
    });

    writeFileSync(
      "rag-input.json",
      JSON.stringify({ chunks, queries }, null, 2)
    );

    const clips = chunksToClips({
      results,
      scoreCutOff: 15,
      searchResults: resultsWithTranscripts.flatMap((x) => x.searchResults),
    });
    if (!clips || !Object.keys(clips).length) {
      const msg = "No clips created";
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(chalk.green(Object.keys(clips).length + " chunks created"));
      return success({ ...args, clips });
    }
  },
};

export interface CleanClipsStageArgs extends RAGStageArgs {
  clips: Record<string, (TranscriptClipWithScore | ArticleSnippetWithScore)[]>;
}

// deduplication
// validation that they are relevant and find start
export const cleanClipsAndClusterStage = {
  name: "clean-clips",
  description: "Clean clips and cluster",
  run: async function (args: CleanClipsStageArgs): Promise<
    | Success<
        CleanClipsStageArgs & {
          groupedClips: Record<
            string,
            Record<
              string,
              (TranscriptClipWithScore | ArticleSnippetWithScore)[]
            >
          >;
        }
      >
    | Failure
  > {
    const { clips } = args;
    console.log(chalk.blue("Cleaning clips..."));
    const tasks = Object.entries(clips).flatMap(([question, clips]) => {
      return clips.flatMap((clip) => async () => {
        if (clip.type === "article") {
          const result = await findStartOfAnswer().execute({
            question,
            text: clip.text,
          });
          if (result?.answersQuestion) {
            if (result.quotedAnswer) {
              const match = nearestSubstring(result.quotedAnswer, clip.text);
              if (match.bestMatch && match.bestScore > 0.8) {
                return {
                  ...clip,
                  text: clip.text.slice(match.bestStartIdx),
                };
              }
            }
            return clip;
          }
          return null;
        } else {
          const result = await findStartOfAnswerYouTube().execute({
            question,
            cues: clip.cues,
          });
          if (result?.answersQuestion) {
            if (result.cueId !== undefined) {
              const newCues = clip.cues.slice(result.cueId);
              return {
                ...clip,
                start: newCues[0].start,
                cues: newCues,
              };
            }
            return clip;
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

    for (const { query, questions } of args.queriesWithQuestions) {
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

    console.log(chalk.green(cleanedClips.length + " clips cleaned"));
    return success({ ...args, groupedClips });
  },
};

// interface SaveResultsToDBStageArgs extends RankClipsStageArgs {
//   orderedClips: {
//     query: string;
//     searchResult: MetaphorYouTubeResult;
//     title: string;
//     summary: string;
//     start: number;
//     end: number;
//     videoTitle: string;
//     videoUrl: string;
//     videoId: string;
//     text: string;
//   }[];
// }

// export const saveResultsToDB = {
//   name: "save-results",
//   description: "Save results to DB",
//   run: async function (
//     args: SaveResultsToDBStageArgs
//   ): Promise<Success<SaveResultsToDBStageArgs> | Failure> {
//     const finalData = {
//       summary: args.profile,
//       clips: args.orderedClips,
//       username: args.user,
//     };
//     writeFileSync("finalData.json", JSON.stringify(finalData, null, 2));
//     await trpc.addRecommendations.mutate(finalData);
//     return success(args);
//   },
// };
