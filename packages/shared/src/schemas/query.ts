import * as z from "zod"
import { CompleteSummary, RelatedSummaryModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const QueryModel = z.object({
  id: z.number().int(),
  summaryId: z.number().int(),
  data: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteQuery extends z.infer<typeof QueryModel> {
  summary: CompleteSummary
}

/**
 * RelatedQueryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQueryModel: z.ZodSchema<CompleteQuery> = z.lazy(() => QueryModel.extend({
  summary: RelatedSummaryModel,
}))
