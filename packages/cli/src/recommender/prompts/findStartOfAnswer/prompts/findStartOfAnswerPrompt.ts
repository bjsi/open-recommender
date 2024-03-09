import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { FindStartOfAnswerInput } from "../schemas/findStartOfAnswerOutputSchema";

export const findStartOfAnswerPrompt =
  new CandidatePrompt<FindStartOfAnswerInput>({
    name: "main",
    compile() {
      return [
        ChatMessage.system(
          `
# Instructions
- Given a question from the user, evalutate whether the beginning of the answer is in the text.
- If the beginning of the answer is in the text, quote the beginning of the answer.
- The answer doesn't need to be complete, just the start of it.
- Quote the beginning of the answer directly from the text.
`.trim()
        ),
        ChatMessage.user(
          `
# Question
${this.getVariable("question")}

# Text
${this.getVariable("text")}
`.trim()
        ),
      ];
    },
  });
