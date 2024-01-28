import { z } from "zod";

export const brainstormQuestionsInputSchema = z.object({
  query: z.string(),
});

export type BrainstormQuestionsInput = z.infer<
  typeof brainstormQuestionsInputSchema
>;
