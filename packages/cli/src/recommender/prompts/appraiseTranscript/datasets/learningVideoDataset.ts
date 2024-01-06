import { transcriptToString } from "../../../../youtube/transcript";
import { learningVideoTranscript } from "../../shared/exampleData";

export const learningVideoDataSet = {
  transcript: {
    name: "Learning Video",
    value: transcriptToString(learningVideoTranscript.cues),
  },
  videoTitle: {
    name: "Learning Video Title",
    value: learningVideoTranscript.videoTitle,
  },
};
