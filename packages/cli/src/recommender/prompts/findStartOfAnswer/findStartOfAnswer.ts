import { Prompt } from "prompt-iteration-assistant";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { openpipe } from "../../../openpipe/openpipe";
import {
  FindStartOfAnswerInput,
  findStartOfAnswerInputSchema,
} from "./schemas/findStartOfAnswerOutputSchema";
import { findStartOfAnswerOutputSchema } from "./schemas/findStartOfAnswerInputSchema";
import { findStartOfAnswerPrompt } from "./prompts/findStartOfAnswerPrompt";

export const FIND_START_OF_ANSWER = "Find Start Of Answer";

class FindStartOfAnswer extends Prompt<
  typeof findStartOfAnswerInputSchema,
  typeof findStartOfAnswerOutputSchema
> {
  constructor() {
    super({
      name: FIND_START_OF_ANSWER,
      description: "Find the start of an answer to a question in some text",
      prompts: [findStartOfAnswerPrompt],
      model: "gpt-4",
      input: findStartOfAnswerInputSchema,
      output: findStartOfAnswerOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    question: string;
    text: string;
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: FindStartOfAnswerInput = {
      text: args.text,
      question: args.question,
    };
    try {
      return this.run({
        stream: false,
        promptVariables,
      });
    } catch (e) {
      console.error(e);
      return { quotedAnswer: null };
    }
  }
}

export const findStartOfAnswer = () => new FindStartOfAnswer();
