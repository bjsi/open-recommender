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
import { DefaultRun } from "modelfusion";

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

  async execute(args: { query: string; run?: DefaultRun }) {
    const promptVariables: BrainstormQuestionsInput = {
      query: args.query,
    };
    try {
      const res = await this.run({
        promptVariables,
        stream: false,
        run: args.run,
      });

      return res?.questions || [];
    } catch (e) {
      console.error(e);
      return [];
    }
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
