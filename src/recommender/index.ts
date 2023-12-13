import { tweetsToString } from "../twitter/getUserContext";
import * as _ from "remeda";
import { Tweet } from "../twitter/schemas";
import { SearchResult } from "../youtube/search";
import { TranscriptCue, transcriptCuesToVtt } from "../youtube/transcript";
import { appraiseTranscript } from "./prompts/appraiseTranscript/appraiseTranscript";
import { splitTranscript } from "./prompts/createClips/helpers/splitTranscript";
import { TranscriptChunk } from "./prompts/createClips/helpers/transcriptClip";
import { createClipsFromTranscript } from "./prompts/createClips/createClips";
import { filterSearchResults } from "./prompts/filterSearchResults/filterSearchResults";
import { searchResultsToString } from "../youtube/formatting";
import { createYouTubeSearchQueries } from "./prompts/createQueries/createQueries";

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
  url: string;
  verbose?: boolean;
}

export const recommender = {
  transcript: {
    appraise: async (args: AppraiseTranscriptArgs) => {
      const text = transcriptCuesToVtt(args.transcript);
      const part = text.slice(0, 7000);
      return appraiseTranscript().run({
        promptVariables: {
          transcript: part,
          videoTitle: args.title,
        },
        stream: false,
      });
    },
    chunk: async (args: ChunkTranscriptArgs) => {
      const text = transcriptCuesToVtt(args.transcript);
      const parts = await splitTranscript(text);
      const chunks: TranscriptChunk[] = [];
      for (const part of parts) {
        const { clips } = await createClipsFromTranscript().run({
          promptVariables: {
            tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
            transcript: part,
            title: args.title,
          },
          stream: false,
          verbose: args.verbose,
        });
        chunks.push(...clips);
      }
      return chunks;
    },
  },
  search: {
    filter: async (args: FilterArgs) => {
      const { recommendedVideos } = await filterSearchResults().run({
        promptVariables: {
          results: searchResultsToString(args.results),
          query: args.query,
          tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        },
        verbose: args.verbose,
        stream: false,
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
        promptVariables: {
          tweets: tweetsToString({ ...args }),
        },
        verbose: args.verbose,
        stream: false,
      });
    },
  },
};
