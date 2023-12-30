import { groupBy, shuffle } from "remeda";
import { tokenize } from "../../tokenize";

type Clip = {
  videoId: string;
  text: string;
};

async function chunkWithMaxTokens<T extends Clip>(args: {
  clips: T[];
  maxTokensPerChunk: number;
  shuffle?: boolean;
}): Promise<T[][]> {
  const chunks: T[][] = [];
  let currentChunk: T[] = [];
  let currentChunkTokens = 0;

  for (const clip of args.clips) {
    const clipTokens = (await tokenize(clip.text)).length;
    if (currentChunkTokens + clipTokens > args.maxTokensPerChunk) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentChunkTokens = 0;
    }
    currentChunk.push(clip);
    currentChunkTokens += clipTokens;
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  return chunks.map((chunk) => (args.shuffle ? shuffle(chunk) : chunk));
}

/**
 * Create arrays of clips.
 * Clip arrays are grouped by videoId if possible.
 * Each clip array has a maximum number of tokens.
 */
export async function chunkClipArray<T extends Clip>(args: {
  clips: T[];
  maxTokensPerChunk: number;
  shuffle?: boolean;
}) {
  let xs = Object.values(groupBy(args.clips, (clip) => clip.videoId))
    .filter((clips) => clips.length > 1)
    .flat();
  xs = xs.concat(
    ...args.clips.filter((clip) => !xs.some((x) => x.videoId === clip.videoId))
  );
  return await chunkWithMaxTokens({ ...args, clips: xs });
}
