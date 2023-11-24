import { appraiseTranscript } from "./appraiseTranscript";
import { chunkTranscript } from "./chunkTranscript";
import { filterSearchResults } from "./filterSearchResults";

export const recommender = {
  transcript: {
    appraise: appraiseTranscript.run,
    chunk: chunkTranscript.run,
  },
  filter: filterSearchResults.run,
};
