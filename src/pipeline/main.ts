import { Pipeline, pipelineArgsSchema } from "./pipeline";
import { getRunById } from "./run";
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
      "The ID of a run to clone from. Use this if you want to reference an old run. If not provided, a new run will be created."
    )
    .option(
      "-st, --stage <stage>",
      "The stage to begin from. Defaults to the first stage."
    )
    .option("-p, --print <key>", "Print the results to stdout.")
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
  const print = opts.print;
  if (print) {
    const clonedRun = getRunById(opts.cloneRunId || "");
    if (!clonedRun) {
      return console.log("No run found");
    }
    const startIndex = opts.stage
      ? clonedRun.stages.findIndex((s) => s.name === opts.stage)
      : 0;
    if (startIndex === -1) {
      return console.log(`Stage ${opts.stage} not found`);
    }
    console.log(
      JSON.stringify(
        clonedRun.stages[startIndex]?.result?.result[print],
        null,
        2
      )
    );
  } else {
    const maybeRecommendations = await pipeline.execute();
    console.log(JSON.stringify(maybeRecommendations, null, 2));
  }
})();
