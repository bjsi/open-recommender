import { Pipeline, pipelineArgsSchema } from "./pipeline";
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
import { Command } from "commander";

(async () => {
  const program = new Command();
  program
    .requiredOption("-u, --user <user>", "Twitter username eg. @experilearning")
    .option(
      "-sr, --searchFilterRelevancyCutOff <searchFilterRelevancyCutOff>",
      "How relevant a search result must be to be included in the search results.",
      (value) => parseFloat(value)
    )
    .option(
      "-cr, --cloneRunId <cloneRunId>",
      "The ID of a run to clone from. Use this if you want to re-run an old run. If not provided, a new run will be created."
    )
    .option(
      "-st, --stage <stage>",
      "The stage to begin running from. If not provided, all stages will be run."
    )
    .parse(process.argv);

  const opts = pipelineArgsSchema.parse({
    ...program.opts(),
    runId: new Date().toISOString(),
  });
  const pipeline = new Pipeline(opts)
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
