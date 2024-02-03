import { z } from "zod";

export const findStartOfAnswerInputSchema = z.object({
  question: z.string(),
  text: z.string(),
});

export type FindStartOfAnswerInput = z.infer<
  typeof findStartOfAnswerInputSchema
>;
