import { Pipeline } from "./pipeline";
import {
  appraiseTranscripts,
  chunkTranscripts,
  createQueries,
  downloadTranscripts,
  filterSearchResults,
  getTweets,
  searchForVideos,
  validateArgs,
} from "./stages";

(async () => {
  const pipeline = new Pipeline({
    runId: new Date().toISOString(),
    searchFilterRelevancyCutOff: 0.65,
    user: process.argv[2],
  })
    .addStage(validateArgs)
    .addStage(getTweets)
    .addStage(createQueries)
    .addStage(searchForVideos)
    .addStage(filterSearchResults)
    .addStage(downloadTranscripts)
    .addStage(appraiseTranscripts)
    .addStage(chunkTranscripts);
  const maybeRecommendations = await pipeline.execute();
  console.log(JSON.stringify(maybeRecommendations, null, 2));
})();
