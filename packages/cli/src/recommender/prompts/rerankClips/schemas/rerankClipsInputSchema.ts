import { z } from "zod";

export const rerankClipsInputSchema = z.object({
  clips: z.string(),
  tweets: z.string(),
});

export type RerankClipsInput = z.infer<typeof rerankClipsInputSchema>;
