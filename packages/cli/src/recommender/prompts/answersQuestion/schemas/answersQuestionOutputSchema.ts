import { z } from "zod";

export const answersQuestionOutputSchema = z.object({
  answersQuestion: z.boolean(),
});

export type AnswersQuestionOutput = z.infer<typeof answersQuestionOutputSchema>;
