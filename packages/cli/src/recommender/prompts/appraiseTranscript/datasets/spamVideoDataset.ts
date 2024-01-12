import { ExampleDataSet } from "prompt-iteration-assistant";
import { spamVideoTranscript } from "../../shared/exampleData";
import { AppraiseTranscriptInput } from "../schemas/appraiseTranscriptInputSchema";

export const spamVideoDataset: ExampleDataSet<AppraiseTranscriptInput> = {
  transcript: {
    name: "spam-transcript",
    value: spamVideoTranscript,
  },
  videoTitle: {
    name: "spam-title",
    value: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
  },
  profile: {
    name: "experilearning",
    value:
      `@experilearning, with the bio 'fascinated by LLM agents | building the best SRS app in the multiverse @rem_note', is an active participant in the discussion on Artificial Intelligence (AI), specifically Language Learning Models (LLMs) and optimization algorithms. The user's tweets involve interacting with prominent figures in the field of AI research like Yann LeCun (@ylecun) and Kenneth Stanley (@kenneth0stanley) on the role of optimization and evolution in AI. The user is also intrigued by natural evolution and its interplay with AI optimization, sharing views on the limitations of viewing evolution as merely an optimization process.   The user also responds to tweets around AI from significant contributors to the field, more specifically involving the regulation versus advancement of AI in the UK, discussion of mechanisms for the evaluation of AI agents, and thoughts on evolutionary algorithms. The user expresses a strong interest in learning about and contributing to the development of AI, seen in tweets about hypothesis generation, critique mechanisms in AI functioning, and the understanding and engineering of AI prompts. The user engages in technical aspects, such as implementing hypothesis outputs and dealing with validation errors.  Another predominant theme in their Twitter activity involves programming, demonstrated by their sharing and discussion of code libraries and resources, such as Promptfoo and partial JSON parsing. They also communicate about TypeScript and share GitHub resources. The user displays an inclination towards problem-solving, providing suggestions to help triage and organize support requests and discussing resourceful solutions for programming challenges.   In addition to these professional interests, the user is building an app @rem_note, indicating an entrepreneurial spirit. A common thread of continuous learning runs through their tweets, tying in their professional, programming, and entrepreneurial activities. In other interests, the user also shares thoughts around human flourishing, possibly signalling an interest in existential philosophy or human potential.`.trim(),
  },
};
