import { Prompt } from "prompt-iteration-assistant";
import {
  RecommendClipsCustomInput,
  recommendClipsInputSchema,
} from "./schemas/recommendClipsInputSchema";
import { withExamplePrompt } from "./prompts/withExample";
import { recommendClipsOutputSchema } from "./schemas/recommendClipsOutputSchema";
import { unrelatedDataset1 } from "./datasets/unrelated1";
import { unrelatedDataset2 } from "./datasets/unrelated2";
import { relatedDataset } from "./datasets/related";
import { splitTranscript } from "./helpers/splitTranscript";
import { tweetsToString } from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import { TranscriptClip } from "./helpers/transcriptClip";
import { searchAndChunk } from "../../dialogs/searchAndChunk";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";

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

  async execute(
    args: {
      enableOpenPipeLogging?: boolean;
      openPipeRequestTags?: RequestTagsWithoutName;
    } & RecommendClipsCustomInput
  ): Promise<TranscriptClip[]> {
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
          model: "openpipe:two-towns-joke",
        },
        openPipeRequestTags: args.openPipeRequestTags
          ? {
              ...args.openPipeRequestTags,
              promptName: formatPromptName(this.name, candidatePrompt.name),
            }
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

export const recommendClips = () => {
  const recClipsPrompt = new RecommendClipsPrompt();
  recClipsPrompt
    .withCustomTest(
      {
        name: "medium related",
        vars: {
          tweets: unrelatedDataset1.tweets.value,
          title: unrelatedDataset1.title.value,
          transcript: unrelatedDataset1.transcript.value,
          user: unrelatedDataset1.user.value,
          videoId: unrelatedDataset1.videoId.value,
          url: unrelatedDataset1.url.value,
        },
      },
      recClipsPrompt.execute.bind(recClipsPrompt)
    )
    .withCustomTest(
      {
        name: "unrelated",
        vars: {
          tweets: unrelatedDataset2.tweets.value,
          title: unrelatedDataset2.title.value,
          transcript: unrelatedDataset2.transcript.value,
          user: unrelatedDataset2.user.value,
          videoId: unrelatedDataset2.videoId.value,
          url: unrelatedDataset2.url.value,
        },
      },
      recClipsPrompt.execute.bind(recClipsPrompt),
      (output) => {
        const clips: TranscriptClip[] = JSON.parse(output);
        return {
          score: clips.length === 0 ? 1 : 0,
          reason:
            clips.length === 0
              ? "No clips"
              : "Expected no clips, got " + JSON.stringify(clips, null, 2),
          pass: clips.length === 0,
        };
      }
    )
    .withCustomTest(
      {
        name: "strongly related",
        vars: {
          tweets: relatedDataset.tweets.value,
          title: relatedDataset.title.value,
          transcript: relatedDataset.transcript.value,
          user: relatedDataset.user.value,
          videoId: relatedDataset.videoId.value,
          url: relatedDataset.url.value,
        },
      },
      recClipsPrompt.execute.bind(recClipsPrompt)
    )
    .withCommand({
      name: "search and chunk",
      async action() {
        await searchAndChunk();
      },
    });
  return recClipsPrompt;
};
