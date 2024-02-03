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

export class FindStartOfAnswer extends Prompt<
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

  async execute(
    args: FindStartOfAnswerInput & {
      openPipeRequestTags?: RequestTagsWithoutName;
      enableOpenPipeLogging?: boolean;
    }
  ) {
    const promptVariables: FindStartOfAnswerInput = {
      text: args.text,
      question: args.question,
    };
    const candidatePrompt = this.chooseCandidatePrompt(promptVariables);
    const res = await openpipe.functionCall({
      function: {
        name: this.name,
        description: this.description,
        input: this.input!,
        output: this.output!,
      },
      vars: promptVariables,
      prompt: candidatePrompt,
      body: {
        max_tokens: this.max_tokens,
        temperature: this.temperature,
        model: this.model,
        stream: false,
      },
      openPipeRequestTags: args.openPipeRequestTags
        ? {
            ...args.openPipeRequestTags,
            promptName: formatPromptName(this.name, candidatePrompt.name),
          }
        : undefined,
      enableOpenPipeLogging: args.enableOpenPipeLogging,
    });
    return res;
  }
}

export const findStartOfAnswer = () => new FindStartOfAnswer();
//   .withTest({
//     name: "experilearning",
//     vars: {
//       user: experilearningDataset.user.value,
//       bio: experilearningDataset.bio.value,
//       profile: experilearningDataset.profile.value,
//     },
//   });

if (require.main === module) {
  (async () => {
    const res = await findStartOfAnswer().execute({
      text: "",
      question: "How does chain of thought prompting work",
    });
    console.log(res);
  })();
}
