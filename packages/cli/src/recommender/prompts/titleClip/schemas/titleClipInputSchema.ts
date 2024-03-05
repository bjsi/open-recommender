import { z } from "zod";

export const titleClipInputSchema = z.object({
  clip: z.string(),
  videoTitle: z.string(),
  question: z.string(),
});

export type TitleClipInput = z.infer<typeof titleClipInputSchema>;
