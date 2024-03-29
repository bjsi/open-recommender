import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteSummary, RelatedSummaryModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const TweetModel = z.object({
  id: z.number().int(),
  tweetId: z.number().int(),
  tweetedAt: z.date(),
  userId: z.number().int(),
  data: jsonSchema,
  summaryId: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteTweet extends z.infer<typeof TweetModel> {
  user: CompleteUser
  summary?: CompleteSummary | null
}

/**
 * RelatedTweetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTweetModel: z.ZodSchema<CompleteTweet> = z.lazy(() => TweetModel.extend({
  user: RelatedUserModel,
  summary: RelatedSummaryModel.nullish(),
}))
