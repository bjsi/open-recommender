import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteRecommendation, RelatedRecommendationModel } from "./index"

export const NoteModel = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  recommendationId: z.number().int(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteNote extends z.infer<typeof NoteModel> {
  user: CompleteUser
  recommendation: CompleteRecommendation
}

/**
 * RelatedNoteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNoteModel: z.ZodSchema<CompleteNote> = z.lazy(() => NoteModel.extend({
  user: RelatedUserModel,
  recommendation: RelatedRecommendationModel,
}))
