import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { learningVideoTranscript } from "../../shared/exampleData";
import { transcriptToString } from "../../../../youtube/transcript";
import { createClipsInputSchema } from "../schemas/createClipsInputSchema";

export const tradEdCritiqueDataset: ExampleDataSet<
  typeof createClipsInputSchema
> = {
  tweets: {
    name: "ed-critique-tweets",
    value: "",
  },
  transcript: {
    name: "learning-vid",
    value: transcriptToString(learningVideoTranscript.cues),
  },
  title: {
    name: "learning-vid",
    value: learningVideoTranscript.videoTitle,
  },
};
