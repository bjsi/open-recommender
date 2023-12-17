import * as _ from "remeda";
import { appraiseTranscript } from "./prompts/appraiseTranscript/appraiseTranscript";
import { recommendClips } from "./prompts/recommendClips/recommendClips";
import { filterSearchResults } from "./prompts/filterSearchResults/filterSearchResults";
import { createYouTubeSearchQueries } from "./prompts/createQueries/createQueries";
import { rerankClips } from "./prompts/rerankClips/rerankClips";

export const recommender = {
  transcript: {
    appraise: appraiseTranscript().execute,
    chunk: recommendClips().execute,
  },
  search: {
    filter: filterSearchResults().execute,
    rank: rerankClips().execute,
  },
  queries: {
    create: (user: string) => createYouTubeSearchQueries(user).execute,
  },
};
