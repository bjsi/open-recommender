import { z } from "zod";

export const createClipsOutputSchema = z.object({
  clips: z
    .object({
      title: z.string(),
      summary: z.string().describe("A one sentence summary of the section."),
      start: z.string(), // TODO: format?
      end: z.string(), // TODO: format?
    })
    .array(),
});

export type CreateClipsOutputVars = z.infer<typeof createClipsOutputSchema>;
