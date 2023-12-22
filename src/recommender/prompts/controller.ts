import { PromptController } from "prompt-iteration-assistant";
import {
  APPRAISE_TRANSCRIPT,
  appraiseTranscript,
} from "./appraiseTranscript/appraiseTranscript";
import {
  RECOMMEND_CLIPS,
  recommendClips,
} from "./recommendClips/recommendClips";
import {
  CREATE_YOUTUBE_SEARCH_QUERIES,
  createYouTubeSearchQueries,
} from "./createQueries/createQueries";
import {
  RECOMMEND_VIDEOS,
  recommendVideos,
} from "./recommendVideos/recommendVideos";
import { RERANK_CLIPS, rerankClips } from "./rerankClips/rerankClips";

/**
 * Container for all the prompts in the recommender.
 */
export const promptController = new PromptController({
  [APPRAISE_TRANSCRIPT]: appraiseTranscript,
  [RECOMMEND_CLIPS]: recommendClips,
  [CREATE_YOUTUBE_SEARCH_QUERIES]: createYouTubeSearchQueries,
  [RECOMMEND_VIDEOS]: recommendVideos,
  [RERANK_CLIPS]: rerankClips,
});
