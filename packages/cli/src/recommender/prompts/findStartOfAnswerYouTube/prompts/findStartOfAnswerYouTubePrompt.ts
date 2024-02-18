import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { FindStartOfAnswerYouTubeInput } from "../schemas/findStartOfAnswerYouTubeInputSchema";

export const findStartOfAnswerYouTubePrompt =
  new CandidatePrompt<FindStartOfAnswerYouTubeInput>({
    name: "main",
    compile() {
      return [
        ChatMessage.system(
          `
# Instructions
- Given a question from the user, evalutate whether the beginning of the answer is in the transcript.
- If the beginning of the answer is in the transcript, return the ID of the transcript cure where the answer starts.
- The answer doesn't need to be complete, just the start of it.
- If the beginning of the answer is not in the transcript, return null.
`.trim()
        ),
        //         ChatMessage.user(
        //           `
        // # Transcript

        // # Question
        // What is the best way to learn a new language?
        // `.trim()
        //         ),
        //         ChatMessage.assistant<FindStartOfAnswerYouTubeOutput>(null, {
        //           name: toCamelCase(FIND_START_OF_ANSWER_YOUTUBE),
        //           arguments: {
        //             answersQuestion: true,
        //             cueId: 0,
        //           },
        //         }),
        //         ChatMessage.user(
        //           `
        // # Transcript

        // # Question
        // How does chain of thought prompting work?
        // `.trim()
        //         ),
        //         ChatMessage.assistant<FindStartOfAnswerYouTubeOutput>(null, {
        //           name: toCamelCase(FIND_START_OF_ANSWER_YOUTUBE),
        //           arguments: {
        //             answersQuestion: false,
        //           },
        //         }),
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
