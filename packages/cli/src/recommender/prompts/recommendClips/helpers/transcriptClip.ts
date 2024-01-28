import { z } from "zod";
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

export interface TranscriptClipWithScore extends TranscriptClip {
  score: number;
  rank: number;
}

export type TranscriptChunk = Required<
  z.infer<typeof recommendClipsOutputSchema>
>["bestClips"][number];
