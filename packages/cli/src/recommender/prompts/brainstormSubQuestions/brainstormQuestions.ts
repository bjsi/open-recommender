import { Prompt } from "prompt-iteration-assistant";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { openpipe } from "../../../openpipe/openpipe";
import {
  BrainstormQuestionsInput,
  brainstormQuestionsInputSchema,
} from "./schemas/brainstormQuestionsInputSchema";
import { brainstormQuestionsOutputSchema } from "./schemas/brainstormQuestionsOutputSchema";
import { brainstormQuestionsZeroShotPrompt } from "./prompts/zeroShot";

export const BRAINSTORM_QUESTIONS = "Brainstorm Questions";

export class BrainstormQuestions extends Prompt<
  typeof brainstormQuestionsInputSchema,
  typeof brainstormQuestionsOutputSchema
> {
  constructor() {
    super({
      name: BRAINSTORM_QUESTIONS,
      description: "Brainstorm Questions",
      prompts: [brainstormQuestionsZeroShotPrompt],
      model: "gpt-4",
      input: brainstormQuestionsInputSchema,
      output: brainstormQuestionsOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    query: string;
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: BrainstormQuestionsInput = {
      query: args.query,
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
    return res?.questions || [];
  }
}

export const brainstormQuestions = () => new BrainstormQuestions();
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
    const res = await brainstormQuestions().execute({
      query:
        "How can the Lean theorem proving language be used to learn mathematics?",
    });
    console.log(res);
  })();
}
