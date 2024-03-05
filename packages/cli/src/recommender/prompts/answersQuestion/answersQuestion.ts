import { Prompt } from "prompt-iteration-assistant";
import { answersQuestionInputSchema } from "./schemas/answersQuestionInputSchema";
import { answersQuestionOutputSchema } from "./schemas/answersQuestionOutputSchema";
import { answersQuestionPrompt } from "./prompts/answersQuestionPrompt";

export const ANSWERS_QUESTION = "Answers Question";

export const answersQuestion = () =>
  new Prompt({
    name: ANSWERS_QUESTION,
    description:
      "Check whether the text contains the start of an answer to the question",
    prompts: [answersQuestionPrompt],
    model: "gpt-4",
    input: answersQuestionInputSchema,
    output: answersQuestionOutputSchema,
  });

if (require.main === module) {
  (async () => {
    const res = await answersQuestion().run({
      stream: false,
      promptVariables: {
        text: "",
        question: "How does chain of thought prompting work",
      },
    });
    console.log(res);
  })();
}
