import { appraiseTranscript } from "./appraiseTranscript";
import { chunkTranscript } from "./chunkTranscript";
import { createYouTubeSearchQueries } from "./createQueries";
import { filterSearchResults } from "./filterSearchResults";

export const recommender = {
  transcript: {
    appraise: appraiseTranscript.run,
    chunk: chunkTranscript.run,
  },
  search: {
    filter: filterSearchResults.run,
    createQueries: createYouTubeSearchQueries.run,
  },
};
