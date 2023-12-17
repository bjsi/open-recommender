import { Prompt } from "prompt-iteration-assistant";
import { rerankClipsInputSchema } from "./schemas/rerankClipsInputSchema";
import { rerankClipsOutputSchema } from "./schemas/rerankClipsOutputSchema";
import { withExamplePrompt } from "./prompts/withExample";
import { TranscriptClip } from "../recommendClips/helpers/transcriptClip";
import { Tweet } from "../../../twitter/schemas";

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
    tweets: Tweet[];
    clips: TranscriptClip[];
    enableOpenPipeLogging?: boolean;
  }) {
    // sliding window, length 3, step size 1

    const promptVariables = {};
  }
}

export const rerankClips = () => new RerankClips();
