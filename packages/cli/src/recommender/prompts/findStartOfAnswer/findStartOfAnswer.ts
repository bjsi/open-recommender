import { Prompt } from "prompt-iteration-assistant";
import { RequestTagsWithoutName } from "../../../openpipe/requestTags";
import {
  FindStartOfAnswerInput,
  findStartOfAnswerInputSchema,
} from "./schemas/findStartOfAnswerOutputSchema";
import { findStartOfAnswerPrompt } from "./prompts/findStartOfAnswerPrompt";
import { z } from "zod";
import { DefaultRun } from "modelfusion";

export const FIND_START_OF_ANSWER = "Find Start Of Answer";

class FindStartOfAnswer extends Prompt<
  typeof findStartOfAnswerInputSchema,
  z.ZodString
> {
  constructor() {
    super({
      name: FIND_START_OF_ANSWER,
      description: "Find the start of an answer to a question in some text",
      prompts: [findStartOfAnswerPrompt],
      model: "gpt-4",
      input: findStartOfAnswerInputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    question: string;
    text: string;
    run?: DefaultRun;
  }): Promise<string | undefined | null> {
    const promptVariables: FindStartOfAnswerInput = {
      text: args.text,
      question: args.question,
    };
    try {
      return this.run({
        stream: false,
        promptVariables,
        run: args.run,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export const findStartOfAnswer = () => new FindStartOfAnswer();
