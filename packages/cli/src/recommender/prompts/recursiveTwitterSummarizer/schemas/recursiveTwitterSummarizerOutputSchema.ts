import { z } from "zod";

export const recursiveTwitterSummarizerOutputSchema = z.object({
  summary: z.string(),
});

export type RecursiveTwitterSummarizerInput = z.infer<
  typeof recursiveTwitterSummarizerOutputSchema
>;
