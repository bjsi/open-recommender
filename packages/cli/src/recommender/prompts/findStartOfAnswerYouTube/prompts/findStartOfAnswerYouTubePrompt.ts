import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { FindStartOfAnswerYouTubeInput } from "../schemas/findStartOfAnswerYouTubeInputSchema";
import { FindStartOfAnswerYouTubeOutput } from "../schemas/findStartOfAnswerYouTubeOutputSchema";
import { FIND_START_OF_ANSWER_YOUTUBE } from "../findStartOfAnswerYouTube";

export const findStartOfAnswerYouTubePrompt =
  new CandidatePrompt<FindStartOfAnswerYouTubeInput>({
    name: "main",
    compile() {
      return [
        ChatMessage.system(
          `
# Instructions
- Given a question from the user, evaluate whether the beginning of the answer is in the transcript.
- If the beginning of the answer is in the transcript, return the ID of the transcript cue where the answer starts.
- If the beginning of the answer is not in the transcript, return null.
`.trim()
        ),
        ChatMessage.user(
          `# Transcript
ID: 0
Hello, my name is John.
---
ID: 1
I am a software developer interested in learning new languages.
---
ID: 2
The best way to learn a new language is through
---
ID: 3
immersion.

# Question
What is the best way to learn a new language?
`.trim()
        ),
        ChatMessage.assistant<FindStartOfAnswerYouTubeOutput>(null, {
          name: toCamelCase(FIND_START_OF_ANSWER_YOUTUBE),
          arguments: {
            cueId: 2,
          },
        }),
        ChatMessage.user(
          `
# Transcript
${this.getVariable("transcript")}

# Question
${this.getVariable("question")}
`.trim()
        ),
      ];
    },
  });
