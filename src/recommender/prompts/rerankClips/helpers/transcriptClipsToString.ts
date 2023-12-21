import { TranscriptClip } from "../../recommendClips/helpers/transcriptClip";

export function transcriptClipsToString(clips: TranscriptClip[]) {
  return clips
    .map((clip, i) =>
      `
ID: ${i}
${clip.text}
`.trim()
    )
    .join("\n---\n");
}
