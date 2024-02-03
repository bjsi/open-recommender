import { z } from "zod";
import { recommendClipsOutputSchema } from "../schemas/recommendClipsOutputSchema";
import { TranscriptCue } from "../../../../youtube/transcript";

export interface TranscriptClip {
  type: "youtube";
  title: string;
  question: string;
  start: number; // seconds
  end: number; // seconds
  videoTitle: string;
  videoUrl: string; // with timestamp
  videoId: string;
  text: string;
  cues: TranscriptCue[];
}

export interface TranscriptClipWithScore extends TranscriptClip {
  score: number;
  rank: number;
}

export type TranscriptChunk = Required<
  z.infer<typeof recommendClipsOutputSchema>
>["bestClips"][number];
