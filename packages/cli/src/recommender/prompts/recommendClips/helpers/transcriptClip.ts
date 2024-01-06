import { z } from "zod";
import { hhmmssToSeconds } from "./timeUtils";
import { recommendClipsOutputSchema } from "../schemas/recommendClipsOutputSchema";

export interface TranscriptClip {
  title: string;
  summary: string;
  start: number; // seconds
  end: number; // seconds
  videoTitle: string;
  videoUrl: string; // with timestamp
  videoId: string;
  text: string;
}

export type TranscriptChunk = Required<
  z.infer<typeof recommendClipsOutputSchema>
>["clips"][number];
