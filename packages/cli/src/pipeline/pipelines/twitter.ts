import { Pipeline, PipelineArgs } from "../pipeline";
import {
  RAGStage,
  cleanClipsAndClusterStage,
  createQueriesMetaphor,
  downloadTranscripts,
  getTweets,
  searchForVideos,
  summarizeTweets,
  validateArgs,
} from "../stages";

export const twitterPipeline = (opts: PipelineArgs) =>
  new Pipeline(opts)
    .addStage(validateArgs)
    .addStage(getTweets)
    .addStage(summarizeTweets)
    .addStage(createQueriesMetaphor)
    .addStage(searchForVideos)
    .addStage(downloadTranscripts)
    .addStage(RAGStage)
    .addStage(cleanClipsAndClusterStage);
