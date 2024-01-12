import { z } from "zod";

export const filterIrrelevantTweetsOutputSchema = z.object({
  tweetIDs: z.array(z.number()),
});

export type FilterIrrelevantTweetsOutput = z.infer<
  typeof filterIrrelevantTweetsOutputSchema
>;
