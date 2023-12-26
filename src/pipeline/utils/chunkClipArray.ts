import { chunk, groupBy, shuffle } from "remeda";

type Chunk<T extends { videoId: string }> = {
  type: "same-video" | "mix";
  clips: T[];
};

export function chunkClipArray<T extends { videoId: string }>(args: {
  clips: T[];
  windowSize: number;
  shuffle?: boolean;
}) {
  const chunks: Chunk<T>[] = Object.values(
    groupBy(args.clips, (clip) => clip.videoId)
  )
    .filter((clips) => clips.length > 1)
    .flatMap((clips) => {
      // Handle case where there one video has more than windowSize clips
      if (clips.length > args.windowSize) {
        // take the max number of chunks, leave the rest
        const discardLast = clips.length % args.windowSize !== 0;
        const numChunks = Math.floor(clips.length / args.windowSize);
        const chunks = chunk(
          args.shuffle ? shuffle(clips) : clips,
          args.windowSize
        );
        return chunks
          .slice(0, discardLast ? numChunks : numChunks - 1)
          .map((clips) => ({
            type: "same-video",
            clips,
          }));
      } else {
        return {
          type: "same-video",
          clips: args.shuffle ? shuffle(clips) : clips,
        };
      }
    });

  const remainingClips = args.clips.filter(
    (clip) => !chunks.some((chunk) => chunk.clips.includes(clip))
  );

  const chunkedRemainingClips = chunk(
    args.shuffle ? shuffle(remainingClips) : remainingClips,
    args.windowSize
  );
  return chunks.concat(
    chunkedRemainingClips.map((clips) => ({
      type: "mix",
      clips,
    }))
  );
}
