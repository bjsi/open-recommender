import { PromptController } from "prompt-iteration-assistant";
import {
  RECOMMEND_VIDEOS,
  recommendVideos,
} from "./recommendVideos/recommendVideos";
import {
  APPRAISE_TRANSCRIPT,
  appraiseTranscript,
} from "./appraiseTranscript/appraiseTranscript";
import {
  CREATE_YOUTUBE_SEARCH_QUERIES,
  createYouTubeSearchQueries,
} from "./__archived__/createQueries/createQueries";
import {
  CREATE_SEARCH_QUERIES_FROM_PROFILE,
  createQueriesFromProfile,
} from "./createQueriesFromProfile/createQueriesFromProfile";
import {
  RECOMMEND_CLIPS,
  recommendClips,
} from "./recommendClips/recommendClips";
import {
  SUMMARIZE_TWEETS,
  recursivelySummarizeTweets,
} from "./recursiveTwitterSummarizer/recursiveTwitterSummarizer";

/**
 * Container for all the prompts in the recommender.
 */
const promptController = new PromptController({
  [APPRAISE_TRANSCRIPT]: appraiseTranscript,
  [RECOMMEND_CLIPS]: recommendClips,
  [CREATE_YOUTUBE_SEARCH_QUERIES]: createYouTubeSearchQueries,
  [RECOMMEND_VIDEOS]: recommendVideos,
  [SUMMARIZE_TWEETS]: recursivelySummarizeTweets,
  [CREATE_SEARCH_QUERIES_FROM_PROFILE]: createQueriesFromProfile,
});

/**
 * For prompt testing and iteration.
 */
if (require.main === module) {
  promptController.cli();
}
