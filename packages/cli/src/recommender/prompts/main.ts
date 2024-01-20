import { PromptController } from "prompt-iteration-assistant";
import {
  EXTRACT_RELEVANT_TWEETS,
  extractRelevantTweets,
} from "./__archived__/filterIrrelevantTweets/filterIrrelevantTweets";
import {
  RECOMMEND_VIDEOS,
  recommendVideos,
} from "./__archived__/recommendVideos/recommendVideos";
import {
  APPRAISE_TRANSCRIPT,
  appraiseTranscript,
} from "./appraiseTranscript/appraiseTranscript";
import {
  CREATE_YOUTUBE_SEARCH_QUERIES,
  createYouTubeSearchQueries,
} from "./createQueries/createQueries";
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
import { RERANK_CLIPS, rerankClips } from "./rerankClips/rerankClips";

/**
 * Container for all the prompts in the recommender.
 */
const promptController = new PromptController({
  [APPRAISE_TRANSCRIPT]: appraiseTranscript,
  [RECOMMEND_CLIPS]: recommendClips,
  [CREATE_YOUTUBE_SEARCH_QUERIES]: createYouTubeSearchQueries,
  [RECOMMEND_VIDEOS]: recommendVideos,
  [RERANK_CLIPS]: rerankClips,
  [EXTRACT_RELEVANT_TWEETS]: extractRelevantTweets,
  [SUMMARIZE_TWEETS]: recursivelySummarizeTweets,
  [CREATE_SEARCH_QUERIES_FROM_PROFILE]: createQueriesFromProfile,
});

/**
 * For prompt testing and iteration.
 */
if (require.main === module) {
  promptController.cli();
}
