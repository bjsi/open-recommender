import { z } from "zod";
import { hhmmssToSeconds } from "./timeUtils";
import { createClipsOutputSchema } from "../schemas/createClipsOutputSchema";

export interface TranscriptClip {
  title: string;
  summary: string;
  start: number; // seconds
  end: number; // seconds
  videoTitle: string;
  videoUrl: string; // with timestamp
  videoId: string;
}

export type TranscriptChunk = z.infer<
  typeof createClipsOutputSchema
>["clips"][number];

export const chunkToClip = (args: {
  chunk: TranscriptChunk;
  videoTitle: string;
  videoId: string;
}): TranscriptClip => {
  const { chunk, videoId, videoTitle } = args;
  return {
    title: chunk.title,
    summary: chunk.summary,
    start: hhmmssToSeconds(chunk.start),
    end: hhmmssToSeconds(chunk.end),
    videoTitle: videoTitle,
    videoId: videoId,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}&t=${hhmmssToSeconds(
      chunk.start
    )}s`,
  };
};
