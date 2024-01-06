import { z } from "zod";

export const createQueriesOutputSchema = z.object({
  queries: z.array(
    z.object({
      query: z.string(),
      tweetIDs: z.array(z.number()),
    })
  ),
});

export type CreateQueriesOutput = z.infer<typeof createQueriesOutputSchema>;
