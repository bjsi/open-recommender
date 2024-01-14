import { z } from "zod";

export const getNoteForRecommendationInputSchema = z.object({
  recommendationId: z.number(),
});

export const updateNoteForRecommendationInputSchema = z.object({
  recommendationId: z.number(),
  content: z.string(),
});

export type UpdateNoteForRecommendationInput = z.infer<
  typeof updateNoteForRecommendationInputSchema
>;

export interface UpdateNoteForRecommendationOutput {
  success: boolean;
}

export type GetNoteForRecommendationInput = z.infer<
  typeof getNoteForRecommendationInputSchema
>;

export interface GetNoteForRecommendationOutput {
  note: {
    id: number;
    content: string;
    userId: number;
    recommendationId: number;
  } | null;
}
