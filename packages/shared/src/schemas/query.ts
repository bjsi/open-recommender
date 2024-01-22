import * as z from "zod"
import { CompleteSummary, RelatedSummaryModel, CompleteQueryToRecommendationSource, RelatedQueryToRecommendationSourceModel } from "./index"

export const QueryModel = z.object({
  id: z.number().int(),
  summaryId: z.number().int(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  public: z.boolean(),
})

export interface CompleteQuery extends z.infer<typeof QueryModel> {
  summary: CompleteSummary
  recommendationSources: CompleteQueryToRecommendationSource[]
}

/**
 * RelatedQueryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQueryModel: z.ZodSchema<CompleteQuery> = z.lazy(() => QueryModel.extend({
  summary: RelatedSummaryModel,
  recommendationSources: RelatedQueryToRecommendationSourceModel.array(),
}))
