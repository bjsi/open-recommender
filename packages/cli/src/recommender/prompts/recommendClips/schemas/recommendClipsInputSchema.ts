import { z } from "zod";
import { Tweet, TwitterUser } from "shared/src/manual/Tweet";
import { TranscriptCue } from "../../../../youtube/transcript";

export const recommendClipsInputSchema = z.object({
  transcript: z.string(),
  title: z.string(),
  tweets: z.string(),
  profile: z.string(),
});

export type RecommendClipsInput = z.infer<typeof recommendClipsInputSchema>;

export interface RecommendClipsCustomInput {
  user: TwitterUser;
  tweets: Tweet[];
  transcript: TranscriptCue[];
  title: string;
  url: string;
  videoId: string;
  profile: string;
}
