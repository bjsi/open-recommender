import * as z from "zod"
import { CompletePipelineTask, RelatedPipelineTaskModel } from "./index"

export const PipelineTaskLogModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  pipelineTaskId: z.number().int(),
  level: z.string(),
  log: z.string(),
})

export interface CompletePipelineTaskLog extends z.infer<typeof PipelineTaskLogModel> {
  pipelineTask: CompletePipelineTask
}

/**
 * RelatedPipelineTaskLogModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPipelineTaskLogModel: z.ZodSchema<CompletePipelineTaskLog> = z.lazy(() => PipelineTaskLogModel.extend({
  pipelineTask: RelatedPipelineTaskModel,
}))
