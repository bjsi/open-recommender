import * as z from "zod"
import { CompleteQuery, RelatedQueryModel, CompleteRecommendation, RelatedRecommendationModel } from "./index"

export const SubQueryModel = z.object({
  id: z.number().int(),
  queryId: z.number().int(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  public: z.boolean(),
})

export interface CompleteSubQuery extends z.infer<typeof SubQueryModel> {
  query: CompleteQuery
  recommendations: CompleteRecommendation[]
}

/**
 * RelatedSubQueryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSubQueryModel: z.ZodSchema<CompleteSubQuery> = z.lazy(() => SubQueryModel.extend({
  query: RelatedQueryModel,
  recommendations: RelatedRecommendationModel.array(),
}))
