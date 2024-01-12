import { z } from "zod";

export const filterIrrelevantTweetsInputSchema = z.object({
  tweets: z.string(),
});

export type FilterIrrelevantTweetsInput = z.infer<
  typeof filterIrrelevantTweetsInputSchema
>;
