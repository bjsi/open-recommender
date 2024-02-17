import * as z from "zod"
import { RecommendationType } from "@prisma/client"
import { CompleteRecommendationSource, RelatedRecommendationSourceModel, CompleteVote, RelatedVoteModel, CompleteNote, RelatedNoteModel, CompleteUserRecommendation, RelatedUserRecommendationModel, CompleteSubQuery, RelatedSubQueryModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const RecommendationModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.nativeEnum(RecommendationType),
  data: jsonSchema,
  sourceId: z.number().int(),
  recommendationSourceId: z.number().int(),
  public: z.boolean(),
  subQueryId: z.number().int(),
})

export interface CompleteRecommendation extends z.infer<typeof RecommendationModel> {
  source: CompleteRecommendationSource
  votes: CompleteVote[]
  notes: CompleteNote[]
  userRecommendations: CompleteUserRecommendation[]
  subQuery: CompleteSubQuery
}

/**
 * RelatedRecommendationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRecommendationModel: z.ZodSchema<CompleteRecommendation> = z.lazy(() => RecommendationModel.extend({
  source: RelatedRecommendationSourceModel,
  votes: RelatedVoteModel.array(),
  notes: RelatedNoteModel.array(),
  userRecommendations: RelatedUserRecommendationModel.array(),
  subQuery: RelatedSubQueryModel,
}))
