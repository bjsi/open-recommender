import { Prompt } from "prompt-iteration-assistant";
import { recommendClipsInputSchema } from "./schemas/recommendClipsInputSchema";
import {
  MAX_CLIP_LENGTH,
  MIN_CLIP_LENGTH,
  withExamplePrompt,
} from "./prompts/withExample";
import {
  RecommendClipsOutput,
  recommendClipsOutputSchema,
} from "./schemas/recommendClipsOutputSchema";
import { unrelatedDataset1 } from "./datasets/unrelated1";
import { unrelatedDataset2 } from "./datasets/unrelated2";
import { relatedDataset } from "./datasets/related";
import { TranscriptCue } from "../../../youtube/transcript";
import { splitTranscript } from "./helpers/splitTranscript";
import { tweetsToString } from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import { Tweet } from "../../../twitter/schemas";
import { TranscriptClip } from "./helpers/transcriptClip";
import { searchAndChunk } from "../../dialogs/searchAndChunk";
import { RequestTagsWithoutName } from "../../../openpipe/requestTags";

export const RECOMMEND_CLIPS = "Recommend Clips";

/**
 * Extract clips from the transcript based on the user's tweets.
 * We could use YouTube's chapters, but they are not always available, accurate or granular enough.
 */
export class RecommendClipsPrompt extends Prompt<
  typeof recommendClipsInputSchema,
  typeof recommendClipsOutputSchema
> {
  constructor() {
    super({
      name: RECOMMEND_CLIPS,
      description:
        "Recommend relevant clips from a transcript to the user based on their interests.",
      prompts: [withExamplePrompt],
      model: "gpt-4",
      input: recommendClipsInputSchema,
      output: recommendClipsOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    enableOpenPipeLogging?: boolean;
    openPipeRequestTags?: RequestTagsWithoutName;
    user: string;
    tweets: Tweet[];
    transcript: TranscriptCue[];
    title: string;
    url: string;
    videoId: string;
    verbose?: boolean;
  }): Promise<TranscriptClip[]> {
    const text = args.transcript
      .map((cue, i) =>
        `
ID: ${i}
${cue.text}
`.trim()
      )
      .join(`\n---\n`);

    const parts = await splitTranscript({ text, separators: ["---"] });
    const chunks: TranscriptClip[] = [];
    for (const part of parts) {
      const promptVariables = {
        tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        transcript: part,
        title: args.title,
      };

      const candidatePrompt = this.chooseCandidatePrompt(promptVariables);
      const res = await openpipe.functionCall({
        function: {
          name: this.name,
          description: this.description,
          input: this.input!,
          output: this.output!,
        },
        vars: promptVariables,
        prompt: candidatePrompt,
        body: {
          max_tokens: this.max_tokens,
          temperature: this.temperature,
          model: this.model,
        },
        openPipeRequestTags: args.openPipeRequestTags
          ? { ...args.openPipeRequestTags, promptName: candidatePrompt.name }
          : undefined,
        enableOpenPipeLogging: args.enableOpenPipeLogging,
      });
      for (const clip of res?.clips || []) {
        const cues = args.transcript.slice(clip.startId, clip.endId + 1);
        chunks.push({
          title: clip.title,
          summary: clip.reason,
          text: cues.map((cue) => cue.text).join(" "),
          start: cues[0].start,
          end: cues[cues.length - 1].end,
          videoId: args.videoId,
          videoUrl: cues[0].url,
          videoTitle: args.title,
        });
      }
    }
    return chunks;
  }
}

const testClipLength = (output: RecommendClipsOutput) => {
  const clips = output.clips || [];
  const wrongLength = clips.find((clip) => {
    const n_cues = clip.endId - clip.startId;
    return n_cues < MIN_CLIP_LENGTH || n_cues > MAX_CLIP_LENGTH;
  });
  if (wrongLength) {
    return {
      score: 0,
      reason:
        "At least one clip is too short or too long:\n" +
        JSON.stringify(wrongLength, null, 2),
      pass: false,
    };
  }
  return {
    score: 1,
    reason: "",
    pass: true,
  };
};

export const recommendClips = () =>
  new RecommendClipsPrompt()
    .withTest(
      {
        name: "medium related",
        vars: {
          tweets: unrelatedDataset1.tweets.value,
          title: unrelatedDataset1.title.value,
          transcript: unrelatedDataset1.transcript.value,
        },
      },
      testClipLength
    )
    .withTest(
      {
        name: "unrelated",
        vars: {
          tweets: unrelatedDataset2.tweets.value,
          title: unrelatedDataset2.title.value,
          transcript: unrelatedDataset2.transcript.value,
        },
      },
      // expect no clips to be created
      (output) => {
        const clips = output.clips || [];
        return {
          score: clips.length === 0 ? 1 : 0,
          reason: "",
          pass: clips.length === 0,
        };
      },
      testClipLength
    )
    .withTest(
      {
        name: "strongly related",
        vars: {
          tweets: relatedDataset.tweets.value,
          title: relatedDataset.title.value,
          transcript: relatedDataset.transcript.value,
        },
      },
      testClipLength
    )
    .withCommand({
      name: "search and chunk",
      async action() {
        await searchAndChunk();
      },
    });
