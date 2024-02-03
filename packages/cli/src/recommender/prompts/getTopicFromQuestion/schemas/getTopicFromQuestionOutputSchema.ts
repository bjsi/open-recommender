import { z } from "zod";

export const getTopicFromQuestionOutputSchema = z.object({
  query: z.string(),
});

export type GetTopicFromQuestionOutput = z.infer<
  typeof getTopicFromQuestionOutputSchema
>;
