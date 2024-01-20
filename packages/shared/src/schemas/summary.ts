import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteQuery, RelatedQueryModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const SummaryModel = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  data: jsonSchema,
  public: z.boolean(),
  useForRecommendations: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSummary extends z.infer<typeof SummaryModel> {
  user: CompleteUser
  queries: CompleteQuery[]
}

/**
 * RelatedSummaryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSummaryModel: z.ZodSchema<CompleteSummary> = z.lazy(() => SummaryModel.extend({
  user: RelatedUserModel,
  queries: RelatedQueryModel.array(),
}))
