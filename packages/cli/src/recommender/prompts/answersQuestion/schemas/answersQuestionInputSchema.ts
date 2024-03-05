import { z } from "zod";

export const answersQuestionInputSchema = z.object({
  question: z.string(),
  text: z.string(),
});

export type AnswersQuestionInput = z.infer<typeof answersQuestionInputSchema>;
