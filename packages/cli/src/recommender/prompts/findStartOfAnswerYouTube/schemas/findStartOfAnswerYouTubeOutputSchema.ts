import { z } from "zod";

export const findStartOfAnswerYouTubeOutputSchema = z.object({
  answersQuestion: z.boolean(),
  cueId: z.number().optional(),
});

export type FindStartOfAnswerYouTubeOutput = z.infer<
  typeof findStartOfAnswerYouTubeOutputSchema
>;
