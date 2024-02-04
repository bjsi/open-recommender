import { PipelineArgs, pipelineArgsSchema } from "./pipeline";
import { twitterPipeline } from "./pipelines/twitter";
import { getRunById } from "./run";
import { Command } from "commander";
import fs from "fs";

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
    .option(
      "-l, --enableLogging",
      "Enable logging to OpenPipe (disable for tests and sensitive information)"
    )
    .option(
      "-sf, --summaryFile <summaryFile>",
      "Provide an existing summary file to use instead of generating a new one."
    )
    .option(
      "-cq, --customQuery <customQuery>",
      "Provide a custom query to use."
    )
    .parse(process.argv);

  const summary = program.opts().summaryFile
    ? fs.readFileSync(program.opts().summaryFile, "utf-8")
    : undefined;

  const opts: PipelineArgs = pipelineArgsSchema.parse({
    ...program.opts(),
    runId: new Date().toISOString(),
    summary,
  });
  const pipeline = twitterPipeline(opts);
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
    if (maybeRecommendations.success) {
      console.log(
        JSON.stringify(maybeRecommendations.result.groupedClips, null, 2)
      );
    } else {
      console.log(maybeRecommendations.result);
    }
  }
})();
