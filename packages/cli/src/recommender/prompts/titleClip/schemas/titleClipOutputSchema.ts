import { z } from "zod";

export const titleClipOutputSchema = z.object({
  title: z.string(),
});

export type TitleClipOutput = z.infer<typeof titleClipOutputSchema>;
