import { appraiseTranscript } from "./appraiseTranscript";
import { chunkTranscript } from "./chunkTranscript";
import { filterSearchResults } from "./filterSearchResults";
import { summarizeTranscript } from "./summarizeTranscript";

export const recommender = {
  transcript: {
    appraise: appraiseTranscript,
    chunk: chunkTranscript,
    summarize: summarizeTranscript,
  },
  filter: filterSearchResults,
};
