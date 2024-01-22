import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteRecommendation, RelatedRecommendationModel } from "./index"

export const UserRecommendationModel = z.object({
  userId: z.number().int(),
  recommendationId: z.number().int(),
  priority: z.number().int(),
  viewed: z.boolean(),
})

export interface CompleteUserRecommendation extends z.infer<typeof UserRecommendationModel> {
  user: CompleteUser
  recommendation: CompleteRecommendation
}

/**
 * RelatedUserRecommendationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserRecommendationModel: z.ZodSchema<CompleteUserRecommendation> = z.lazy(() => UserRecommendationModel.extend({
  user: RelatedUserModel,
  recommendation: RelatedRecommendationModel,
}))
