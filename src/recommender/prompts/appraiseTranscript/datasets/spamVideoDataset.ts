import { spamVideoTranscript } from "../../shared/exampleData";

export const spamVideoDataset = {
  transcript: {
    name: "spam-transcript",
    value: spamVideoTranscript,
  },
  videoTitle: {
    name: "spam-title",
    value: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
  },
};

if (require.main === module) {
  console.log(spamVideoDataset.transcript.value.slice(0, 500 * 4));
}
