import { Prompt } from "prompt-iteration-assistant";
import {
  RerankClipsInput,
  rerankClipsInputSchema,
} from "./schemas/rerankClipsInputSchema";
import { rerankClipsOutputSchema } from "./schemas/rerankClipsOutputSchema";
import { zeroShotPrompt } from "./prompts/withExample";
import { TranscriptClip } from "../recommendClips/helpers/transcriptClip";
import { Tweet } from "../../../twitter/schemas";
import { tweetsToString } from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import _ from "remeda";

export const RERANK_CLIPS = "Rerank Clips";

/**
 * To find the best video clips to show to the user, we use a re-ranking prompt loosely based on https://github.com/sunnweiwei/RankGPT.
 * To get around context length limitations in cases where there are many clips, we use a sliding window approach.
 * In each call we compare and order four clips. The lowest ranked clip is discarded
 */
class RerankClips extends Prompt<
  typeof rerankClipsInputSchema,
  typeof rerankClipsOutputSchema
> {
  constructor() {
    super({
      name: RERANK_CLIPS,
      description:
        "Order YouTube video clips based on their relevance to the user's interests.",
      prompts: [zeroShotPrompt],
      model: "gpt-4",
      input: rerankClipsInputSchema,
      output: rerankClipsOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: string;
    tweets: Tweet[];
    clips: TranscriptClip[];
    enableOpenPipeLogging?: boolean;
  }) {
    const callApi = async (windowClips: TranscriptClip[]) => {
      const promptVariables: RerankClipsInput = {
        tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        clips: windowClips
          .map((clip, i) =>
            `
ID: ${i}
${clip.title}
${clip.text}
`.trim()
          )
          .join("\n---\n"),
      };
      const { orderedClipIds } = await openpipe.functionCall({
        input: this.input!,
        output: this.output!,
        vars: promptVariables,
        prompt: this.prompts[0],
        body: {
          max_tokens: this.max_tokens,
          temperature: this.temperature,
          model: this.model,
        },
        enableOpenPipeLogging: args.enableOpenPipeLogging,
      });
      return orderedClipIds.map((id) => windowClips[id]);
    };

    if (args.clips.length === 0) {
      return [];
    } else if (args.clips.length === 1) {
      return args.clips;
    } else {
      const windowSize = 4;
      let topClips: TranscriptClip[] = [];
      const initialWindow = args.clips.slice(0, windowSize);
      // initial rank
      const orderedClips = await callApi(initialWindow);
      topClips = orderedClips.slice(0, windowSize - 1);
      // rerank all
      for (let i = windowSize; i < args.clips.length; i++) {
        const window = topClips.concat(args.clips[i]);
        const orderedWindow = await callApi(window);
        // discard the bottom ranked clip
        topClips = orderedWindow.slice(0, windowSize - 1);
      }
      return _.uniq(topClips);
    }
  }
}

export const rerankClips = () => new RerankClips();
