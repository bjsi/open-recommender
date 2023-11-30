import { tweetsToString } from "../twitter/getUserContext";
import { Tweet } from "../twitter/schemas";
import { SearchResult } from "../youtube/search";
import { TranscriptCue, transcriptCuesToVtt } from "../youtube/transcript";
import { appraiseTranscript } from "./appraiseTranscript";
import {
  TranscriptChunk,
  chunkTranscript,
  rejectedChunkTags,
  splitTranscript,
} from "./chunkTranscript";
import { createYouTubeSearchQueries } from "./createQueries";
import {
  filterSearchResults,
  searchResultsToString,
} from "./filterSearchResults";

interface FilterArgs {
  results: SearchResult[];
  queries: string[];
  verbose?: boolean;
}

interface CreateQueriesArgs {
  tweets: Tweet[];
  user: string;
  verbose?: boolean;
}

interface AppraiseTranscriptArgs {
  transcript: TranscriptCue[];
  title: string;
  verbose?: boolean;
}

interface ChunkTranscriptArgs {
  transcript: TranscriptCue[];
  title: string;
  verbose?: boolean;
}

export const recommender = {
  transcript: {
    appraise: async (args: AppraiseTranscriptArgs) => {
      const text = transcriptCuesToVtt(args.transcript);
      const parts = await splitTranscript(text);
      return appraiseTranscript.run({
        promptVars: {
          transcript: parts[0],
          title: args.title,
        },
      });
    },
    chunk: async (args: ChunkTranscriptArgs) => {
      const text = transcriptCuesToVtt(args.transcript);
      const parts = await splitTranscript(text);
      const chunks: TranscriptChunk[] = [];
      for (const part of parts) {
        const { sections } = await chunkTranscript.run({
          promptVars: {
            transcript: part,
            title: args.title,
          },
          verbose: args.verbose,
        });
        chunks.push(...sections);
      }
      return chunks.filter(
        (chunk) => !chunk.tags.some((tag) => rejectedChunkTags.includes(tag))
      );
    },
  },
  search: {
    filter: async (args: FilterArgs) => {
      const { recommendedVideos } = await filterSearchResults.run({
        promptVars: {
          results: searchResultsToString(args.results),
          queries: args.queries,
        },
        verbose: args.verbose,
      });
      return recommendedVideos.map((id) => args.results[id]);
    },
  },
  queries: {
    create: (args: CreateQueriesArgs) => {
      return createYouTubeSearchQueries.run({
        promptVars: {
          tweets: tweetsToString(args.tweets, args.user),
        },
        verbose: args.verbose,
      });
    },
  },
};
