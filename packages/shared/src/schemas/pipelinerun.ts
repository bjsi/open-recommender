import * as z from "zod"
import { TaskStatus } from "@prisma/client"
import { CompletePipelineTask, RelatedPipelineTaskModel } from "./index"

export const PipelineRunModel = z.object({
  id: z.number().int(),
  jobKeyId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string(),
  status: z.nativeEnum(TaskStatus),
})

export interface CompletePipelineRun extends z.infer<typeof PipelineRunModel> {
  tasks: CompletePipelineTask[]
}

/**
 * RelatedPipelineRunModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPipelineRunModel: z.ZodSchema<CompletePipelineRun> = z.lazy(() => PipelineRunModel.extend({
  tasks: RelatedPipelineTaskModel.array(),
}))
