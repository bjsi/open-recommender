import { Prompt } from "prompt-iteration-assistant";
import {
  AnswersQuestionInput,
  answersQuestionInputSchema,
} from "./schemas/answersQuestionInputSchema";
import { answersQuestionOutputSchema } from "./schemas/answersQuestionOutputSchema";
import { answersQuestionPrompt } from "./prompts/answersQuestionPrompt";

export const ANSWERS_QUESTION = "Answers Question";

class AnswersQuestion extends Prompt<
  typeof answersQuestionInputSchema,
  typeof answersQuestionOutputSchema
> {
  constructor() {
    super({
      name: ANSWERS_QUESTION,
      description:
        "Check whether the text contains the start of an answer to the question",
      prompts: [answersQuestionPrompt],
      model: "gpt-4",
      input: answersQuestionInputSchema,
      output: answersQuestionOutputSchema,
    });
  }
  async execute(args: AnswersQuestionInput) {
    try {
      return this.run({
        stream: false,
        promptVariables: args,
      });
    } catch (e) {
      console.error(e);
      return { answersQuestion: false };
    }
  }
}

export const answersQuestion = () => new AnswersQuestion();
