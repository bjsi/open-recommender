import { Prompt } from "prompt-iteration-assistant";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { openpipe } from "../../../openpipe/openpipe";
import {
  GetTopicFromQuestionInput,
  getTopicFromQuestionInputSchema,
} from "./schemas/getTopicFromQuestionInputSchema";
import { getTopicFromQuestionOutputSchema } from "./schemas/getTopicFromQuestionOutputSchema";
import { getTopicFromQuestionZeroShotPrompt } from "./prompts/zeroShot";

export const GET_TOPIC_FROM_QUESTION = "Get Query From Question";

export class GetTopicFromQuestion extends Prompt<
  typeof getTopicFromQuestionInputSchema,
  typeof getTopicFromQuestionOutputSchema
> {
  constructor() {
    super({
      name: GET_TOPIC_FROM_QUESTION,
      description: "Convert question to query topic",
      prompts: [getTopicFromQuestionZeroShotPrompt],
      model: "gpt-3.5-turbo",
      input: getTopicFromQuestionInputSchema,
      output: getTopicFromQuestionOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    question: string;
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: GetTopicFromQuestionInput = {
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
    return res?.query;
  }
}

export const getTopicFromQuestion = () => new GetTopicFromQuestion();
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
    const res = await getTopicFromQuestion().execute({
      question: "How does chain of thought prompting work",
      // "How can the Lean theorem proving language be used to learn mathematics?",
    });
    console.log(res);
  })();
}
