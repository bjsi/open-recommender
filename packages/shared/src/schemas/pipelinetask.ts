import * as z from "zod"
import { TaskStatus } from "@prisma/client"
import { CompletePipelineRun, RelatedPipelineRunModel } from "./index"

export const PipelineTaskModel = z.object({
  id: z.number().int(),
  jobId: z.string(),
  pipelineRunId: z.number().int(),
  name: z.string(),
  status: z.nativeEnum(TaskStatus),
})

export interface CompletePipelineTask extends z.infer<typeof PipelineTaskModel> {
  pipelineRun: CompletePipelineRun
}

/**
 * RelatedPipelineTaskModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPipelineTaskModel: z.ZodSchema<CompletePipelineTask> = z.lazy(() => PipelineTaskModel.extend({
  pipelineRun: RelatedPipelineRunModel,
}))
