import { Prompt } from "prompt-iteration-assistant";
import {
  CreateQueriesFromProfileInput,
  createQueriesFromProfileInputSchema,
} from "./schemas/createQueriesFromProfileInputSchema";
import { createQueriesFromProfileOutputSchema } from "./schemas/createQueriesFromProfileOutputSchema";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { openpipe } from "../../../openpipe/openpipe";
import { experilearningDataset } from "./datasets/experilearningDataset";
import { createQueriesFromProfileZeroShotFreeFormPrompt } from "./prompts/zeroShotFreeForm";

export const CREATE_SEARCH_QUERIES_FROM_PROFILE =
  "Create Search Queries From Profile";

/**
 * We use GPT to create YouTube search queries based on the user's profile.
 * Getting this prompt right is critical to the success of the recommender.
 */
export class CreateSearchQueriesFromProfile extends Prompt<
  typeof createQueriesFromProfileInputSchema,
  typeof createQueriesFromProfileOutputSchema
> {
  constructor() {
    super({
      name: CREATE_SEARCH_QUERIES_FROM_PROFILE,
      description:
        "Create YouTube video search queries based on the user's profile.",
      prompts: [createQueriesFromProfileZeroShotFreeFormPrompt],
      model: "gpt-4",
      input: createQueriesFromProfileInputSchema,
      output: createQueriesFromProfileOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: string;
    profile: string;
    bio: string;
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: CreateQueriesFromProfileInput = {
      user: args.user,
      bio: args.bio,
      profile: args.profile,
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
    return res || { queries: [] };
  }
}

export const createQueriesFromProfile = () =>
  new CreateSearchQueriesFromProfile().withTest({
    name: "experilearning",
    vars: {
      user: experilearningDataset.user.value,
      bio: experilearningDataset.bio.value,
      profile: experilearningDataset.profile.value,
    },
  });

if (require.main === module) {
  (async () => {
    const res = await createQueriesFromProfile().execute({
      user: experilearningDataset.user.value,
      bio: experilearningDataset.bio.value,
      profile: experilearningDataset.profile.value,
    });
    console.log(res);
  })();
}
