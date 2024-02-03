import { z } from "zod";

export const findStartOfAnswerYouTubeInputSchema = z.object({
  question: z.string(),
  transcript: z.string(),
});

export type FindStartOfAnswerYouTubeInput = z.infer<
  typeof findStartOfAnswerYouTubeInputSchema
>;
