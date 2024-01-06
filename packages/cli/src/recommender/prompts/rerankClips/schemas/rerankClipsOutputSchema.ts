import { z } from "zod";

export const rerankClipsOutputSchema = z.object({
  orderedClipIds: z.number().array(),
  reasoning: z.string().optional(),
});

export type RerankClipsOutput = z.infer<typeof rerankClipsOutputSchema>;
