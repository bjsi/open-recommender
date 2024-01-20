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
} from "./__archived__/recommendVideos/recommendVideos";
import { RERANK_CLIPS, rerankClips } from "./rerankClips/rerankClips";
import {
  EXTRACT_RELEVANT_TWEETS,
  extractRelevantTweets,
} from "./__archived__/filterIrrelevantTweets/filterIrrelevantTweets";
import {
  SUMMARIZE_TWEETS,
  recursivelySummarizeTweets,
} from "./recursiveTwitterSummarizer/recursiveTwitterSummarizer";
import {
  CREATE_SEARCH_QUERIES_FROM_PROFILE,
  createQueriesFromProfile,
} from "./createQueriesFromProfile/createQueriesFromProfile";
