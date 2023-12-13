import { z } from "zod";

export const appraiseTranscriptInputSchema = z.object({
  transcript: z.string(),
  videoTitle: z.string().optional(),
});
