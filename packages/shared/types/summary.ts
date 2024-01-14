import { z } from "zod";

export const summarySchema = z.object({
  type: z.literal("tweets"),
  createdAt: z.date(),
  data: z.object({
    tweetIds: z.array(z.number()),
    startDate: z.number(),
    endDate: z.number(),
    summary: z.string(),
  }),
});

export type Summary = z.infer<typeof summarySchema>;
