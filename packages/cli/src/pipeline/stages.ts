import chalk from "chalk";
import { twitter } from "../twitter";
import { Tweet } from "shared/src/manual/Tweet";
import { yt } from "../youtube";
import { Failure, Success, failure, success } from "./run";
import { Transcript } from "../youtube/transcript";
import { PipelineArgs, pipelineArgsSchema } from "./pipeline";
import { pAll } from "./utils/pAll";
import { createRequestTags } from "../openpipe/requestTags";
import { recursivelySummarizeTweets } from "../recommender/prompts/recursiveTwitterSummarizer/recursiveTwitterSummarizer";
import { createQueriesFromProfile } from "../recommender/prompts/createQueriesFromProfile/createQueriesFromProfile";
import { MetaphorYouTubeResult, searchYouTube } from "../metaphor/search";
import { trpc } from "../trpc";
import { searchTranscripts } from "../rag/rag";
import { brainstormQuestions } from "../recommender/prompts/brainstormSubQuestions/brainstormQuestions";
import { compact } from "remeda";
import { TranscriptClipWithScore } from "../recommender/prompts/recommendClips/helpers/transcriptClip";
import { getUserProfile } from "../twitter/getUserContext";
import { initTwitterAPI } from "../twitter/twitterAPI";

export const STAGES = [
  "validate-args",
  "get-tweets",
  "summarize-tweets",
  "create-queries-metaphor",
  "search-for-videos",
  "download-transcripts",
  "appraise-transcripts",
  "rag",
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
    const { queries } = await createQueriesFromProfile().execute({
      enableOpenPipeLogging: args.enableLogging,
      openPipeRequestTags: createRequestTags(args),
      profile,
      bio,
      user,
    });
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
  searchResults: MetaphorYouTubeResult[];
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

    const queryWithResults: QueryWithSearchResult[] = await pAll(
      queriesWithQuestions.map(({ query, questions }) => async () => {
        const rawSearchResultsForQuery = await searchYouTube({ query });
        console.log(
          chalk.blue(
            rawSearchResultsForQuery
              .map((result, idx) => `${idx + 1}. ${result.title}`)
              .join("\n")
          )
        );
        return {
          query,
          questions,
          searchResults: rawSearchResultsForQuery,
        };
      }),
      { concurrency: 10 }
    );
    console.log(
      chalk.blue("Found " + queryWithResults.length + " search results")
    );
    return success({ ...args, queryWithResults });
  },
};

type QueryWithSearchResultWithTranscript = {
  searchResults: (MetaphorYouTubeResult & { transcript: Transcript })[];
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
          resultsWithTranscripts.length + " transcripts fetched successfully"
        )
      );
      return success({ ...args, resultsWithTranscripts });
    }
  },
};

// interface AppraiseTranscriptsStageArgs extends DownloadTranscriptsStageArgs {
//   resultsWithTranscripts: QueryWithSearchResultWithTranscript[];
// }

// export const appraiseTranscripts = {
//   name: "appraise-transcripts",
//   description: "Appraise transcripts",
//   run: async function (args: AppraiseTranscriptsStageArgs) {
//     const { resultsWithTranscripts } = args;
//     console.log(
//       chalk.blue(`Appraising ${resultsWithTranscripts.length} transcripts...`)
//     );
//     const appraisedResults: QueryWithSearchResultWithTranscript[] = (
//       await pAll(
//         resultsWithTranscripts.map((result) => async () => {
//           const { recommend, reasoning } = await appraiseTranscript().execute({
//             transcript: result.cues,
//             title: result.searchResult.title,
//             profile: args.profile,
//             enableOpenPipeLogging: args.enableLogging,
//             openPipeRequestTags: createRequestTags(args),
//           });
//           if (!recommend) {
//             console.log(
//               chalk.blue(
//                 `Rejecting video ${result.searchResult.title}. ${reasoning}`
//               )
//             );
//             return;
//           } else {
//             console.log(
//               chalk.green(
//                 `Accepting video ${result.searchResult.title}. ${reasoning}`
//               )
//             );
//             return result;
//           }
//         }),
//         { concurrency: 10 }
//       )
//     ).filter(Boolean) as QueryWithSearchResultWithTranscript[];
//     if (!appraisedResults.length) {
//       const msg = "No transcripts passed the appraisal filter";
//       console.log(chalk.red(msg));
//       return failure(msg);
//     } else {
//       console.log(
//         chalk.green(
//           appraisedResults.length + " transcripts passed the appraisal filter"
//         )
//       );
//       return success({ ...args, appraisedResults });
//     }
//   },
// };

interface RAGStageArgs extends DownloadTranscriptsStageArgs {
  resultsWithTranscripts: QueryWithSearchResultWithTranscript[];
}

export const RAGStage = {
  name: "rag",
  description: "RAG Chunk transcripts",
  run: async function (
    args: RAGStageArgs
  ): Promise<
    | Success<
        RAGStageArgs & { chunks: Record<string, TranscriptClipWithScore[]> }
      >
    | Failure
  > {
    const { resultsWithTranscripts } = args;
    console.log(
      chalk.blue(`Chunking ${resultsWithTranscripts.length} transcripts...`)
    );
    const clips: Record<string, TranscriptClipWithScore[]> = {};
    for (const result of resultsWithTranscripts) {
      const chunks = await searchTranscripts({
        queries: result.questions,
        transcripts: result.searchResults.map((x) => x.transcript),
        scoreCutOff: 19,
      });
      for (const question of Object.keys(chunks)) {
        if (!clips[question]) {
          clips[question] = [];
        }
        clips[question].push(...chunks[question]);
      }
    }
    if (!Object.keys(clips).length) {
      const msg = "No transcripts chunked";
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(chalk.green(Object.keys(clips).length + " chunks created"));
      return success({ ...args, chunks: clips });
    }
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
