import { z } from "zod";

export const getTopicFromQuestionInputSchema = z.object({
  question: z.string(),
});

export type GetTopicFromQuestionInput = z.infer<
  typeof getTopicFromQuestionInputSchema
>;
