import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteQuery, RelatedQueryModel, CompleteTweet, RelatedTweetModel } from "./index"

export const SummaryModel = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  public: z.boolean(),
  content: z.string(),
  useForRecommendations: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSummary extends z.infer<typeof SummaryModel> {
  user: CompleteUser
  queries: CompleteQuery[]
  tweets: CompleteTweet[]
}

/**
 * RelatedSummaryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSummaryModel: z.ZodSchema<CompleteSummary> = z.lazy(() => SummaryModel.extend({
  user: RelatedUserModel,
  queries: RelatedQueryModel.array(),
  tweets: RelatedTweetModel.array(),
}))
