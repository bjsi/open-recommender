import { z } from "zod";

export const brainstormQuestionsOutputSchema = z.object({
  questions: z.string().array(),
});

export type BrainstormQuestionsOutput = z.infer<
  typeof brainstormQuestionsOutputSchema
>;
