import { z } from "zod";

export const recommendClipsOutputSchema = z.object({
  clips: z
    .object({
      title: z.string(),
      reason: z
        .string()
        .describe(
          "A one sentence reason why you recommend this clip to the user."
        ),
      startId: z.number(),
      endId: z.number(),
    })
    .array()
    .optional(),
});

export type RecommendClipsOutput = z.infer<typeof recommendClipsOutputSchema>;
