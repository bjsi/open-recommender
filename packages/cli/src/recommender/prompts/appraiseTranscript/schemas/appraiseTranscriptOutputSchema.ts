import { z } from "zod";

export const appraiseTrancriptOuputSchema = z.object({
  reasoning: z.string(),
  recommend: z.boolean(),
});

export type AppraiseTrancriptOuput = z.infer<
  typeof appraiseTrancriptOuputSchema
>;
