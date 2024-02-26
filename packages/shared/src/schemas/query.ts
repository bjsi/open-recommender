import * as z from "zod"
import { CompleteSummary, RelatedSummaryModel, CompleteQueryToRecommendationSource, RelatedQueryToRecommendationSourceModel, CompleteSubQuery, RelatedSubQueryModel, CompleteUser, RelatedUserModel } from "./index"

export const QueryModel = z.object({
  id: z.number().int(),
  summaryId: z.number().int().nullish(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  public: z.boolean(),
  userId: z.number().int(),
})

export interface CompleteQuery extends z.infer<typeof QueryModel> {
  summary?: CompleteSummary | null
  recommendationSources: CompleteQueryToRecommendationSource[]
  subQueries: CompleteSubQuery[]
  user: CompleteUser
}

/**
 * RelatedQueryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQueryModel: z.ZodSchema<CompleteQuery> = z.lazy(() => QueryModel.extend({
  summary: RelatedSummaryModel.nullish(),
  recommendationSources: RelatedQueryToRecommendationSourceModel.array(),
  subQueries: RelatedSubQueryModel.array(),
  user: RelatedUserModel,
}))
