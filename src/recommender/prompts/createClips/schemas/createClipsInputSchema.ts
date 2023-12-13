import { z } from "zod";

export const createClipsInputSchema = z.object({
  transcript: z.string(),
  title: z.string(),
  tweets: z.string(),
});

export type CreateClipsInputVars = z.infer<typeof createClipsInputSchema>;
