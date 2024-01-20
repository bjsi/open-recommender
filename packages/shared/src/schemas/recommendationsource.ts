import * as z from "zod"
import { RecommendationType } from "@prisma/client"
import { CompleteRecommendation, RelatedRecommendationModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const RecommendationSourceModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.nativeEnum(RecommendationType),
  data: jsonSchema,
})

export interface CompleteRecommendationSource extends z.infer<typeof RecommendationSourceModel> {
  recommendations: CompleteRecommendation[]
}

/**
 * RelatedRecommendationSourceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRecommendationSourceModel: z.ZodSchema<CompleteRecommendationSource> = z.lazy(() => RecommendationSourceModel.extend({
  recommendations: RelatedRecommendationModel.array(),
}))
