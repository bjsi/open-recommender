import { z } from "zod";
import { recommendClipsOutputSchema } from "../schemas/recommendClipsOutputSchema";

export type TranscriptChunk = Required<
  z.infer<typeof recommendClipsOutputSchema>
>["bestClips"][number];
