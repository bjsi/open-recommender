import { z } from "zod";

export const findStartOfAnswerOutputSchema = z.object({
  answersQuestion: z.boolean(),
  quotedAnswer: z.string().optional(),
});

export type FindStartOfAnswerOutput = z.infer<
  typeof findStartOfAnswerOutputSchema
>;
