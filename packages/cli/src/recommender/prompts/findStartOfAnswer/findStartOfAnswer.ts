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

export const findStartOfAnswer = () =>
  new Prompt({
    name: FIND_START_OF_ANSWER,
    description: "Find the start of an answer to a question in some text",
    prompts: [findStartOfAnswerPrompt],
    model: "gpt-4",
    input: findStartOfAnswerInputSchema,
    output: findStartOfAnswerOutputSchema,
    exampleData: [],
  });

if (require.main === module) {
  (async () => {})();
}
