import { z } from "zod";

export const findStartOfAnswerOutputSchema = z.object({
  quotedAnswer: z.string().nullish(),
});

export type FindStartOfAnswerOutput = z.infer<
  typeof findStartOfAnswerOutputSchema
>;
