import { PromptController } from "prompt-iteration-assistant";
import {
  APPRAISE_TRANSCRIPT,
  appraiseTranscript,
} from "./appraiseTranscript/appraiseTranscript";
import {
  CREATE_CLIPS,
  createClipsFromTranscript,
} from "./createClips/createClips";
import {
  CREATE_YOUTUBE_SEARCH_QUERIES,
  createYouTubeSearchQueries,
} from "./createQueries/createQueries";
import {
  RECOMMEND_VIDEOS,
  filterSearchResults,
} from "./filterSearchResults/filterSearchResults";

/**
 * Container for all the prompts in the recommender.
 */
export const promptController = new PromptController({
  [APPRAISE_TRANSCRIPT]: appraiseTranscript,
  [CREATE_CLIPS]: createClipsFromTranscript,
  [CREATE_YOUTUBE_SEARCH_QUERIES]: createYouTubeSearchQueries,
  [RECOMMEND_VIDEOS]: filterSearchResults,
});
