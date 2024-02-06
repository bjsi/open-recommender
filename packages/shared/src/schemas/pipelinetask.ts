import * as z from "zod"
import { TaskStatus } from "@prisma/client"
import { CompletePipelineRun, RelatedPipelineRunModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const PipelineTaskModel = z.object({
  id: z.number().int(),
  jobId: z.string(),
  pipelineRunId: z.number().int(),
  name: z.string(),
  data: jsonSchema,
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
