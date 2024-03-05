import { z } from "zod";

export const transcriptClipSchema = z.object({
  type: z.literal("youtube"),
  title: z.string(),
  question: z.string(),
  start: z.number(),
  end: z.number(),
  videoTitle: z.string(),
  videoUrl: z.string(),
  videoId: z.string(),
  summarizedTitle: z.string().optional(),
  text: z.string(),
  cues: z.array(
    z.object({
      text: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
});

export type TranscriptClip = z.infer<typeof transcriptClipSchema>;

export const transcriptClipWithScore = transcriptClipSchema.extend({
  score: z.number(),
  rank: z.number(),
});

export type TranscriptClipWithScore = z.infer<typeof transcriptClipWithScore>;
