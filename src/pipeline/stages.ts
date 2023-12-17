import chalk from "chalk";
import { twitter } from "../twitter";
import { recommender } from "../recommender";
import { Tweet } from "../twitter/schemas";
import { tweetsToString } from "../twitter/getUserContext";
import { SearchResult } from "../youtube/search";
import { yt } from "../youtube";
import { Failure, Success, failure, success } from "./run";
import { TranscriptCue } from "../youtube/transcript";
import { PipelineArgs, pipelineArgsSchema } from "./pipeline";
import { TranscriptChunk } from "../recommender/prompts/recommendClips/helpers/transcriptClip";

export const STAGES = [
  "validate-args",
  "get-tweets",
  "create-queries",
  "search-for-videos",
  "filter-search-results",
  "download-transcripts",
  "appraise-transcripts",
  "chunk-transcripts",
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
  ): Promise<Success<CreateQueriesStageArgs> | Failure> {
    const { user } = args;
    console.log(
      chalk.blue(`Creating recommendations for Twitter user @${user}`)
    );

    // get user context

    console.log(chalk.blue("Fetching tweets..."));
    const tweets = await twitter.tweets.fetch({
      user,
      n_tweets: 30,
    });
    if (!tweets.length) {
      console.log(chalk.red("No tweets found"));
    } else {
      console.log(chalk.green(tweets.length + " tweets fetched successfully"));
    }
    return success({ ...args, tweets });
  },
};

interface CreateQueriesStageArgs extends PipelineArgs {
  tweets: Tweet[];
}

export const createQueries = {
  name: "create-queries",
  description: "Create queries for YouTube search",
  run: async function (
    args: CreateQueriesStageArgs
  ): Promise<Success<SearchForVideosStageArgs> | Failure> {
    const { tweets, user } = args;
    console.log(chalk.blue("Creating search queries..."));
    const { queries } = await recommender.queries.create({
      tweets,
      user,
    });
    if (!queries.length) {
      const msg = "No search queries generated";
      console.log(chalk.red(msg));
      return failure(msg);
    }

    const queriesWithTweets = queries.map(({ query, tweetIDs }) => ({
      query,
      tweets: tweetIDs.map((id) => tweets[id]),
    }));
    console.log(chalk.green("Created " + queries.length + " search queries"));
    for (let i = 0; i < queriesWithTweets.length; i++) {
      const { query, tweets } = queriesWithTweets[i];
      console.log("-----------------");
      console.log(chalk.blue(i + ". " + query.join(" ")));
      console.log(tweetsToString({ tweets, user }));
    }
    return success({ ...args, queriesWithTweets });
  },
};

interface SearchForVideosStageArgs extends CreateQueriesStageArgs {
  queriesWithTweets: {
    query: string[];
    tweets: Tweet[];
  }[];
}

type SearchResultsWithTweets = {
  searchResults: SearchResult[];
  query: string;
  tweets: Tweet[];
};

export const searchForVideos = {
  name: "search-for-videos",
  description: "Search for videos on YouTube",
  run: async function (
    args: SearchForVideosStageArgs
  ): Promise<Success<FilterSearchResultsStageArgs> | Failure> {
    const { queriesWithTweets } = args;

    console.log(chalk.blue("Searching YouTube..."));

    const rawSearchResults: SearchResultsWithTweets[] = [];
    for (const { query, tweets } of queriesWithTweets) {
      console.log(chalk.blue("Searching for " + query.join(" ")));
      const rawSearchResultsForQuery = await yt.search({
        query: query.join(" "),
      });
      console.log(
        chalk.blue(
          rawSearchResultsForQuery
            .map((result, idx) => `${idx + 1}. ${result.title}`)
            .join("\n")
        )
      );
      rawSearchResults.push({
        query: query.join(" "),
        tweets: tweets,
        searchResults: rawSearchResultsForQuery,
      });
    }
    console.log(
      chalk.blue("Found " + rawSearchResults.length + " search results")
    );
    return success({ ...args, rawSearchResults });
  },
};

interface FilterSearchResultsStageArgs extends SearchForVideosStageArgs {
  rawSearchResults: SearchResultsWithTweets[];
}

export const filterSearchResults = {
  name: "filter-search-results",
  description: "Filter search results",
  run: async function (
    args: FilterSearchResultsStageArgs
  ): Promise<Success<DownloadTranscriptsStageArgs> | Failure> {
    const { rawSearchResults, user } = args;
    const filteredResults: {
      searchResults: { result: SearchResult; relevance: number }[];
      query: string;
      tweets: Tweet[];
    }[] = [];
    for (const rawSearchResult of rawSearchResults) {
      const {
        query,
        tweets,
        searchResults: rawYouTubeSearchResults,
      } = rawSearchResult;
      console.log(chalk.blue("Filtering search results..."));
      const filteredResultsForQuery = await recommender.search.filter({
        user,
        query: query,
        results: rawYouTubeSearchResults,
        tweets,
      });

      console.log("Filtered search results:");

      console.log(
        filteredResultsForQuery
          .map(
            ({ result, relevance }, idx) =>
              `${idx + 1}. ${result.title} (${relevance})`
          )
          .join("\n")
      );

      const relevantResults = filteredResultsForQuery.filter(
        (result) => result.relevance > args.searchFilterRelevancyCutOff
      );

      filteredResults.push({
        query: query,
        tweets: tweets,
        searchResults: relevantResults,
      });
    }
    if (!filteredResults.length) {
      const msg = "No search results passed the search filter";
      console.log(msg);
      return failure(msg);
    }
    console.log(
      chalk.green("Search results that passed the initial search filter:")
    );
    console.log(
      filteredResults
        .flatMap((r) => r.searchResults)
        .map(({ result }, idx) => `${idx + 1}. ${result.title}`)
        .join("\n")
    );
    return success({ ...args, filteredResults });
  },
};

type SearchResultWithTranscript = {
  searchResult: SearchResult;
  tweets: Tweet[];
  cues: TranscriptCue[];
  query: string;
  relevance: number;
};

interface DownloadTranscriptsStageArgs extends SearchForVideosStageArgs {
  filteredResults: {
    searchResults: { result: SearchResult; relevance: number }[];
    query: string;
    tweets: Tweet[];
  }[];
}

export const downloadTranscripts = {
  name: "download-transcripts",
  description: "Download transcripts for videos",
  run: async function (
    args: DownloadTranscriptsStageArgs
  ): Promise<Success<AppraiseTranscriptsStageArgs> | Failure> {
    const { filteredResults } = args;
    console.log(
      chalk.blue(
        `Fetching ${
          filteredResults.flatMap((r) => r.searchResults).length
        } transcripts...`
      )
    );
    const resultsWithTranscripts: SearchResultWithTranscript[] = [];
    for (const results of filteredResults) {
      for (const result of results.searchResults) {
        const { id, title } = result.result;
        const fetchResult = await yt.transcript.fetch({ id, title });
        if (!fetchResult || !fetchResult.cues.length) {
          console.log("Skipping video without transcript");
          continue;
        }
        resultsWithTranscripts.push({
          searchResult: result.result,
          cues: fetchResult.cues,
          tweets: results.tweets,
          query: results.query,
          relevance: result.relevance,
        });
      }
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
    console.log(chalk.blue("Appraising transcripts..."));
    const appraisedResults: SearchResultWithTranscript[] = [];
    for (const result of resultsWithTranscripts) {
      const { recommend, reasoning } = await recommender.transcript.appraise({
        transcript: result.cues,
        title: result.searchResult.title,
        verbose: true,
      });
      if (!recommend) {
        console.log(
          chalk.blue(
            `Rejecting video ${result.searchResult.title}. ${reasoning}`
          )
        );
        continue;
      } else {
        console.log(
          chalk.green(
            `Accepting video ${result.searchResult.title}. ${reasoning}`
          )
        );
        appraisedResults.push({ ...result });
      }
    }
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

type SearchResultWithTranscriptAndChunks = {
  searchResult: SearchResult;
  cues: TranscriptCue[];
  chunks: TranscriptChunk[];
};

export const chunkTranscripts = {
  name: "chunk-transcripts",
  description: "Chunk transcripts",
  run: async function (args: ChunkTranscriptsStageArgs): Promise<
    | Success<
        ChunkTranscriptsStageArgs & {
          chunkedTranscripts: SearchResultWithTranscriptAndChunks[];
        }
      >
    | Failure
  > {
    const { appraisedResults, user } = args;
    const chunkedTranscripts: SearchResultWithTranscriptAndChunks[] = [];
    for (const result of appraisedResults) {
      console.log(
        chalk.blue(`Generating chapters for "${result.searchResult.title}"...`)
      );
      const chunks = await recommender.transcript.chunk({
        tweets: result.tweets,
        user,
        transcript: result.cues,
        title: result.searchResult.title,
        url: "https://www.youtube.com/watch?v=" + result.searchResult.id,
      });
      if (!chunks.length) {
        console.log(
          chalk.red("No chapters generated for " + result.searchResult.title)
        );
        continue;
      } else {
        console.log(
          chalk.green(
            `${chunks.length} chapters generated for "${result.searchResult.title}"`
          )
        );
        console.log(chunks);
        chunkedTranscripts.push({
          ...result,
          chunks,
        });
      }
    }

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
