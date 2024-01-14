import chalk from "chalk";
import { twitter } from "../twitter";
import { Tweet } from "../twitter/schemas";
import { tweetsToString } from "../twitter/getUserContext";
import { yt } from "../youtube";
import { Failure, Success, failure, success } from "./run";
import { TranscriptCue } from "../youtube/transcript";
import { PipelineArgs, pipelineArgsSchema } from "./pipeline";
import { TranscriptClip } from "../recommender/prompts/recommendClips/helpers/transcriptClip";
import { appraiseTranscript } from "../recommender/prompts/appraiseTranscript/appraiseTranscript";
import { recommendClips } from "../recommender/prompts/recommendClips/recommendClips";
import { rerankClips } from "../recommender/prompts/rerankClips/rerankClips";
import { pAll } from "./utils/pAll";
import { shuffle } from "./utils/shuffle";
import { chunkClipArray } from "./utils/chunkClipArray";
import { createRequestTags } from "../openpipe/requestTags";
import { recursivelySummarizeTweets } from "../recommender/prompts/recursiveTwitterSummarizer/recursiveTwitterSummarizer";
import { createQueriesFromProfile } from "../recommender/prompts/createQueriesFromProfile/createQueriesFromProfile";
import { MetaphorYouTubeResult, searchYouTubeVideos } from "../metaphor/search";

export const STAGES = [
  "validate-args",
  "get-tweets",
  "summarize-tweets",
  "create-queries",
  "search-for-videos",
  "filter-search-results",
  "download-transcripts",
  "appraise-transcripts",
  "chunk-transcripts",
  "order-clips",
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
    console.log(
      chalk.blue(`Creating recommendations for Twitter user @${user}`)
    );

    // get user context

    console.log(chalk.blue("Fetching tweets..."));
    const tweets = (
      await twitter.tweets.fetch({
        user,
        n_tweets: 200,
      })
    ).slice(0, 300);
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
    const profile = await recursivelySummarizeTweets().execute({
      user,
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
    const { tweets, profile, bio, user } = args;
    console.log(chalk.blue("Creating search queries..."));
    const { queries } = await createQueriesFromProfile().execute({
      enableOpenPipeLogging: args.enableLogging,
      openPipeRequestTags: createRequestTags(args),
      profile,
      bio,
      user,
    });
    if (!queries.length) {
      const msg = "No search queries generated";
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(chalk.green(queries.length + " queries generated"));
      console.log(chalk.blue("Queries:"));
      console.log(queries);
      return success({ ...args, queries });
    }
  },
};

interface SearchForVideosStageArgs extends CreateQueriesStageArgs {
  queries: string[];
}

type SearchResult = {
  searchResults: MetaphorYouTubeResult[];
  query: string;
};

export const searchForVideos = {
  name: "search-for-videos",
  description: "Search for videos on YouTube",
  run: async function (
    args: SearchForVideosStageArgs
  ): Promise<Success<DownloadTranscriptsStageArgs> | Failure> {
    const { queries } = args;

    console.log(chalk.blue("Searching YouTube..."));

    const searchResults: SearchResult[] = await pAll(
      queries.map((query) => async () => {
        const rawSearchResultsForQuery = await searchYouTubeVideos(query);
        console.log(
          chalk.blue(
            rawSearchResultsForQuery
              .map((result, idx) => `${idx + 1}. ${result.title}`)
              .join("\n")
          )
        );
        return {
          query,
          searchResults: rawSearchResultsForQuery,
        };
      }),
      { concurrency: 5 }
    );
    console.log(
      chalk.blue("Found " + searchResults.length + " search results")
    );
    return success({ ...args, searchResults });
  },
};

type SearchResultWithTranscript = {
  searchResult: MetaphorYouTubeResult;
  cues: TranscriptCue[];
  query: string;
};

interface DownloadTranscriptsStageArgs extends SearchForVideosStageArgs {
  searchResults: SearchResult[];
}

export const downloadTranscripts = {
  name: "download-transcripts",
  description: "Download transcripts for videos",
  run: async function (
    args: DownloadTranscriptsStageArgs
  ): Promise<Success<AppraiseTranscriptsStageArgs> | Failure> {
    const { searchResults } = args;
    console.log(chalk.blue(`Fetching ${searchResults.length} transcripts...`));
    const resultsWithTranscripts: SearchResultWithTranscript[] = [];
    for (const results of searchResults) {
      await pAll(
        results.searchResults.map((result) => async () => {
          const { id, title } = result;
          const fetchResult = await yt.transcript.fetch({ id, title });
          if (!fetchResult || !fetchResult.cues.length) {
            console.log("Skipping video without transcript");
            return;
          }
          resultsWithTranscripts.push({
            searchResult: result,
            cues: fetchResult.cues,
            query: results.query,
          });
        }),
        { concurrency: 3 }
      );
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

interface AppraiseTranscriptsStageArgs extends DownloadTranscriptsStageArgs {
  resultsWithTranscripts: SearchResultWithTranscript[];
}

export const appraiseTranscripts = {
  name: "appraise-transcripts",
  description: "Appraise transcripts",
  run: async function (args: AppraiseTranscriptsStageArgs) {
    const { resultsWithTranscripts } = args;
    console.log(
      chalk.blue(`Appraising ${resultsWithTranscripts.length} transcripts...`)
    );
    const appraisedResults: SearchResultWithTranscript[] = (
      await pAll(
        resultsWithTranscripts.map((result) => async () => {
          const { recommend, reasoning } = await appraiseTranscript().execute({
            transcript: result.cues,
            title: result.searchResult.title,
            profile: args.profile,
            enableOpenPipeLogging: args.enableLogging,
            openPipeRequestTags: createRequestTags(args),
          });
          if (!recommend) {
            console.log(
              chalk.blue(
                `Rejecting video ${result.searchResult.title}. ${reasoning}`
              )
            );
            return;
          } else {
            console.log(
              chalk.green(
                `Accepting video ${result.searchResult.title}. ${reasoning}`
              )
            );
            return result;
          }
        }),
        { concurrency: 10 }
      )
    ).filter(Boolean) as SearchResultWithTranscript[];
    if (!appraisedResults.length) {
      const msg = "No transcripts passed the appraisal filter";
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(
        chalk.green(
          appraisedResults.length + " transcripts passed the appraisal filter"
        )
      );
      return success({ ...args, appraisedResults });
    }
  },
};

interface ChunkTranscriptsStageArgs extends AppraiseTranscriptsStageArgs {
  appraisedResults: SearchResultWithTranscript[];
}

export const chunkTranscripts = {
  name: "chunk-transcripts",
  description: "Chunk transcripts",
  run: async function (args: ChunkTranscriptsStageArgs): Promise<
    | Success<
        ChunkTranscriptsStageArgs & {
          chunkedTranscripts: TranscriptClip[];
        }
      >
    | Failure
  > {
    const { appraisedResults, user } = args;
    const chunkedTranscripts: TranscriptClip[] = (
      await pAll(
        appraisedResults.map((result) => async () => {
          const chunks = await recommendClips().execute({
            tweets: [],
            openPipeRequestTags: createRequestTags(args),
            enableOpenPipeLogging: args.enableLogging,
            user,
            transcript: result.cues,
            title: result.searchResult.title,
            url: "https://www.youtube.com/watch?v=" + result.searchResult.id,
            videoId: result.searchResult.id,
            profile: args.profile,
          });
          if (!chunks.length) {
            console.log(
              chalk.red(
                "No chapters generated for " + result.searchResult.title
              )
            );
            return;
          } else {
            console.log(
              chalk.green(
                `${chunks.length} chapters generated for "${result.searchResult.title}"`
              )
            );
            console.log(chunks);
            return chunks;
          }
        }),
        { concurrency: 10 }
      )
    )
      .filter(Boolean)
      .flat() as TranscriptClip[];

    if (!chunkedTranscripts.length) {
      const msg = "No transcripts chunked";
      console.log(chalk.red(msg));
      return failure(msg);
    } else {
      console.log(
        chalk.green(
          chunkedTranscripts.length + " transcripts chunked successfully"
        )
      );
      return success({ ...args, chunkedTranscripts });
    }
  },
};

interface RankClipsStageArgs extends ChunkTranscriptsStageArgs {
  chunkedTranscripts: TranscriptClip[];
}

export const rankClips = {
  name: "order-clips",
  description: "Order Clips",
  run: async function (args: RankClipsStageArgs): Promise<
    | Success<
        RankClipsStageArgs & {
          orderedClips: TranscriptClip[];
        }
      >
    | Failure
  > {
    // order globally over all transcripts and all clips
    const allClips = shuffle(args.chunkedTranscripts);
    console.log(chalk.blue(`Ordering ${allClips.length} clips...`));

    // each window contains 8 clips
    // we order then discard the bottom 4 clips
    // we do some special handling for clips from the
    // same video to ensure we don't have too many clips from the same video
    const maxDesiredNumClips = 30;
    // TODO: don't hardcode
    const maxTokens =
      8192 -
      // for output
      500 -
      (
        await rerankClips().calculateCost({
          clips: "",
          profile: args.profile,
          tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        })
      ).total;
    const ratioToDiscard = 0.5;
    const maxClipsPerVideo = 3;

    let remainingClips = allClips;

    // TODO: what if we start with less than maxDesired clips?
    while (remainingClips.length > maxDesiredNumClips) {
      let chunked = await chunkClipArray({
        clips: remainingClips,
        maxTokensPerChunk: maxTokens,
        shuffle: true,
      });
      remainingClips = (
        await pAll(
          chunked.map((chunk) => async () => {
            const orderedClips = await rerankClips({
              windowSize: chunk.length,
              numToDiscard:
                chunk.every((clip) => clip.videoId === chunk[0]?.videoId) &&
                chunk.length > maxClipsPerVideo
                  ? chunk.length - maxClipsPerVideo
                  : Math.floor(chunk.length * ratioToDiscard),
            }).execute({
              enableOpenPipeLogging: args.enableLogging,
              openPipeRequestTags: createRequestTags(args),
              user: args.user,
              tweets: args.tweets,
              profile: args.profile,
              clips: chunk,
            });
            return orderedClips;
          }),
          {
            concurrency: 10,
          }
        )
      ).flat();
      console.log(chalk.blue(`Remaining clips: ${remainingClips.length}`));
    }

    return success({ ...args, orderedClips: remainingClips });
  },
};
