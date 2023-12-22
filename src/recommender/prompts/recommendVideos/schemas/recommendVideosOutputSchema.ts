import { z } from "zod";

export const recommendVideosOutputSchema = z.object({
  recommendedVideos: z.array(
    z.object({
      id: z.number(),
      relevance: z.number().describe("Relevance is a float between 0 and 1."),
    })
  ),
});

export type RecommendVideosOutput = z.infer<typeof recommendVideosOutputSchema>;
