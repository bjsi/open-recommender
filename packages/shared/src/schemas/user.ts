import * as z from "zod"
import { CompleteTweet, RelatedTweetModel, CompleteSummary, RelatedSummaryModel, CompleteUserRecommendation, RelatedUserRecommendationModel, CompleteVote, RelatedVoteModel, CompleteNote, RelatedNoteModel, CompleteFollow, RelatedFollowModel, CompleteQuery, RelatedQueryModel } from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  twitterId: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  profile_image_url: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  apiKey: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  tweets: CompleteTweet[]
  summaries: CompleteSummary[]
  recommendations: CompleteUserRecommendation[]
  votes: CompleteVote[]
  notes: CompleteNote[]
  followers: CompleteFollow[]
  following: CompleteFollow[]
  queries: CompleteQuery[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  tweets: RelatedTweetModel.array(),
  summaries: RelatedSummaryModel.array(),
  recommendations: RelatedUserRecommendationModel.array(),
  votes: RelatedVoteModel.array(),
  notes: RelatedNoteModel.array(),
  followers: RelatedFollowModel.array(),
  following: RelatedFollowModel.array(),
  queries: RelatedQueryModel.array(),
}))
