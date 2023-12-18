import { Prompt } from "prompt-iteration-assistant";
import {
  RerankClipsInput,
  rerankClipsInputSchema,
} from "./schemas/rerankClipsInputSchema";
import { rerankClipsOutputSchema } from "./schemas/rerankClipsOutputSchema";
import { withExamplePrompt } from "./prompts/withExample";
import { TranscriptClip } from "../recommendClips/helpers/transcriptClip";
import { Tweet } from "../../../twitter/schemas";
import { tweetsToString } from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import _ from "remeda";

export const RERANK_CLIPS = "Rerank Clips";

class RerankClips extends Prompt<
  typeof rerankClipsInputSchema,
  typeof rerankClipsOutputSchema
> {
  constructor() {
    super({
      name: RERANK_CLIPS,
      description:
        "Order YouTube video clips based on their relevance to the user's interests.",
      prompts: [withExamplePrompt],
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
    const callApi = async (clips: TranscriptClip[]) => {
      const promptVariables: RerankClipsInput = {
        tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        clips: clips
          .map(
            (clip, i) => `
ID: ${i}
${clip.title}
${clip.text}
`
          )
          .join("\n---\n"),
      };
      let orderedWindowClipIds: number[] = [];
      if (!args.enableOpenPipeLogging) {
        const { orderedClipIds } = await this.run({
          promptVariables,
          stream: false,
        });
        orderedWindowClipIds = orderedClipIds;
      } else {
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
        });
        orderedWindowClipIds = orderedClipIds;
      }
      return orderedWindowClipIds.map((id) => clips[id]);
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
