import { tweetsToString } from "../twitter/getUserContext";
import * as _ from "remeda";
import { Tweet } from "../twitter/schemas";
import { SearchResult } from "../youtube/search";
import { TranscriptCue, transcriptCuesToVtt } from "../youtube/transcript";
import { appraiseTranscript } from "./appraiseTranscript";
import {
  TranscriptChunk,
  chunkTranscript,
  splitTranscript,
} from "./chunkTranscript";
import { createYouTubeSearchQueries } from "./createQueries";
import {
  filterSearchResults,
  searchResultsToString,
} from "./filterSearchResults";

interface FilterArgs {
  user: string;
  tweets: Tweet[];
  results: SearchResult[];
  query: string;
  verbose?: boolean;
}

interface CreateQueriesArgs {
  user: string;
  tweets: Tweet[];
  verbose?: boolean;
}

interface AppraiseTranscriptArgs {
  transcript: TranscriptCue[];
  title: string;
  verbose?: boolean;
}

interface ChunkTranscriptArgs {
  user: string;
  tweets: Tweet[];
  transcript: TranscriptCue[];
  title: string;
  verbose?: boolean;
}

export const recommender = {
  transcript: {
    appraise: async (args: AppraiseTranscriptArgs) => {
      const text = transcriptCuesToVtt(args.transcript);
      const part = text.slice(0, 7000);
      return appraiseTranscript.run({
        promptVars: {
          transcript: part,
          title: args.title,
        },
      });
    },
    chunk: async (args: ChunkTranscriptArgs) => {
      const text = transcriptCuesToVtt(args.transcript);
      const parts = await splitTranscript(text);
      const chunks: TranscriptChunk[] = [];
      for (const part of parts) {
        const { clips } = await chunkTranscript.run({
          promptVars: {
            tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
            transcript: part,
            title: args.title,
          },
          verbose: args.verbose,
        });
        chunks.push(...clips);
      }
      return chunks;
    },
  },
  search: {
    filter: async (args: FilterArgs) => {
      const { recommendedVideos } = await filterSearchResults.run({
        promptVars: {
          results: searchResultsToString(args.results),
          query: args.query,
          tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        },
        verbose: args.verbose,
      });
      return _.sortBy(recommendedVideos, [(x) => x.relevance, "desc"]).map(
        ({ id, relevance }) => ({
          result: args.results[id],
          relevance,
        })
      );
    },
  },
  queries: {
    create: (args: CreateQueriesArgs) => {
      return createYouTubeSearchQueries(args.user).run({
        promptVars: {
          tweets: tweetsToString({ ...args }),
        },
        verbose: args.verbose,
      });
    },
  },
};
