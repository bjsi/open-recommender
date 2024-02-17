import { z } from "zod";

export const findStartOfAnswerYouTubeOutputSchema = z.object({
  cueId: z.number().nullish(),
});

export type FindStartOfAnswerYouTubeOutput = z.infer<
  typeof findStartOfAnswerYouTubeOutputSchema
>;
