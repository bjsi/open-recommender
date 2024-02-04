import { defineTask } from "./defineTask";
import { PipelineArgs } from "cli/src/pipeline/pipeline";
import { twitterPipeline } from "cli/src/pipeline/pipelines/twitter";

export const twitterPipelineTask = defineTask<PipelineArgs>({
  id: "twitter-pipeline",
  handler: async (payload, helpers) => {
    const output = await twitterPipeline(payload).execute();
    helpers.logger.debug(`Pipeline output: ${JSON.stringify(output)}`);
  },
});
