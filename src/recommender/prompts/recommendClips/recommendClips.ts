import {
  Prompt,
  getInputFromCLI,
  searchList,
} from "prompt-iteration-assistant";
import { recommendClipsInputSchema } from "./schemas/recommendClipsInputSchema";
import { withExamplePrompt } from "./prompts/withExample";
import { recommendClipsOutputSchema } from "./schemas/recommendClipsOutputSchema";
import { unrelatedDataset1 } from "./datasets/unrelated1";
import { unrelatedDataset2 } from "./datasets/unrelated2";
import { relatedDataset } from "./datasets/related";
import { search } from "../../../youtube/search";
import {
  TranscriptCue,
  fetchTranscript,
  transcriptCuesToVtt,
  transcriptToMarkdownCues,
} from "../../../youtube/transcript";
import { splitTranscript } from "./helpers/splitTranscript";
import { program } from "commander";
import {
  loadExampleTweetHistory,
  tweetsToString,
} from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import { Tweet } from "../../../twitter/schemas";
import { TranscriptChunk } from "./helpers/transcriptClip";

export const RECOMMEND_CLIPS = "Recommend Clips";

/**
 * We extract clips from the transcript based on the user's tweets.
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
    user: string;
    tweets: Tweet[];
    transcript: TranscriptCue[];
    title: string;
    url: string;
    verbose?: boolean;
  }) {
    const text = transcriptCuesToVtt(args.transcript);
    const parts = await splitTranscript({ text });
    const chunks: TranscriptChunk[] = [];
    for (const part of parts) {
      const promptVariables = {
        tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        transcript: part,
        title: args.title,
      };
      const { clips } = await openpipe.functionCall({
        function: {
          name: this.name,
          description: this.description,
          input: this.input!,
          output: this.output!,
        },
        vars: promptVariables,
        prompt: this.prompts[0],
        body: {
          max_tokens: this.max_tokens,
          temperature: this.temperature,
          model: this.model,
        },
        enableOpenPipeLogging: args.enableOpenPipeLogging,
      });
      chunks.push(...(clips || []));
    }
    return chunks;
  }
}

export const recommendClips = () =>
  new RecommendClipsPrompt()
    .withTest("medium related", {
      tweets: unrelatedDataset1.tweets.value,
      title: unrelatedDataset1.title.value,
      transcript: unrelatedDataset1.transcript.value,
    })
    .withTest(
      "unrelated",
      {
        tweets: unrelatedDataset2.tweets.value,
        title: unrelatedDataset2.title.value,
        transcript: unrelatedDataset2.transcript.value,
      },
      (output) => {
        const clips = output.clips || [];
        return {
          score: clips.length === 0 ? 1 : 0,
          reason: "",
          pass: clips.length === 0,
        };
      }
    )
    .withTest("strongly related", {
      tweets: relatedDataset.tweets.value,
      title: relatedDataset.title.value,
      transcript: relatedDataset.transcript.value,
    })
    .withCommand({
      name: "search and chunk",
      async action() {
        await searchAndChunk();
      },
    });
