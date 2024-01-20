import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteRecommendation, RelatedRecommendationModel } from "./index"

export const VoteModel = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  recommendationId: z.number().int(),
  vote: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteVote extends z.infer<typeof VoteModel> {
  user: CompleteUser
  recommendation: CompleteRecommendation
}

/**
 * RelatedVoteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedVoteModel: z.ZodSchema<CompleteVote> = z.lazy(() => VoteModel.extend({
  user: RelatedUserModel,
  recommendation: RelatedRecommendationModel,
}))
