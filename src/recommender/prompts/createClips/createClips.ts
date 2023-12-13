import { Prompt } from "prompt-iteration-assistant";
import { createClipsInputSchema } from "./schemas/createClipsInputSchema";
import { withExamplePrompt } from "./prompts/withExample";
import { createClipsOutputSchema } from "./schemas/createClipsOutputSchema";
import { learningVideoTranscript } from "../shared/exampleData";
import { transcriptToString } from "../../../youtube/transcript";
import { tradEdCritiqueDataset } from "./datasets/tradEdCritique";

export const CREATE_CLIPS = "Create Clips From Transcript";

/**
 * We chunk the transcript into logical sections and add metadata using an LLM.
 * We could use YouTube's chapters, but they are not always available, accurate or granular enough.
 */
export const createClipsFromTranscript = () =>
  new Prompt<typeof createClipsInputSchema, typeof createClipsOutputSchema>({
    state: {},
    name: CREATE_CLIPS,
    prompts: [withExamplePrompt],
    model: "gpt-4",
    input: createClipsInputSchema,
    output: createClipsOutputSchema,
    exampleData: [tradEdCritiqueDataset],
  }).withTest(
    "trad-ed-critique",
    {
      transcript: tradEdCritiqueDataset.transcript.value,
      title: tradEdCritiqueDataset.title.value,
      tweets: tradEdCritiqueDataset.tweets.value,
    },
    (output) => {
      return {
        pass: output.clips.length > 0,
        score: output.clips.length > 0 ? 1 : 0,
        reason: "The transcript was chunked into clips.",
      };
    }
  );
