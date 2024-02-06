import * as z from "zod"
import { TaskStatus } from "@prisma/client"
import { CompleteUser, RelatedUserModel, CompletePipelineTask, RelatedPipelineTaskModel } from "./index"

export const PipelineRunModel = z.object({
  id: z.number().int(),
  jobId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number().int(),
  status: z.nativeEnum(TaskStatus),
})

export interface CompletePipelineRun extends z.infer<typeof PipelineRunModel> {
  user: CompleteUser
  tasks: CompletePipelineTask[]
}

/**
 * RelatedPipelineRunModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPipelineRunModel: z.ZodSchema<CompletePipelineRun> = z.lazy(() => PipelineRunModel.extend({
  user: RelatedUserModel,
  tasks: RelatedPipelineTaskModel.array(),
}))
