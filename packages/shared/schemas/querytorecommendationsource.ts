import * as z from "zod"
import { CompleteQuery, RelatedQueryModel, CompleteRecommendationSource, RelatedRecommendationSourceModel } from "./index"

export const QueryToRecommendationSourceModel = z.object({
  id: z.number().int(),
  queryId: z.number().int(),
  recommendationSourceId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteQueryToRecommendationSource extends z.infer<typeof QueryToRecommendationSourceModel> {
  query: CompleteQuery
  recommendationSource: CompleteRecommendationSource
}

/**
 * RelatedQueryToRecommendationSourceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQueryToRecommendationSourceModel: z.ZodSchema<CompleteQueryToRecommendationSource> = z.lazy(() => QueryToRecommendationSourceModel.extend({
  query: RelatedQueryModel,
  recommendationSource: RelatedRecommendationSourceModel,
}))
