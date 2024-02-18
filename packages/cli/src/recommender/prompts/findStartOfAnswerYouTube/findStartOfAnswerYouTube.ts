import { Prompt } from "prompt-iteration-assistant";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { openpipe } from "../../../openpipe/openpipe";
import { findStartOfAnswerYouTubeOutputSchema } from "./schemas/findStartOfAnswerYouTubeOutputSchema";
import {
  FindStartOfAnswerYouTubeInput,
  findStartOfAnswerYouTubeInputSchema,
} from "./schemas/findStartOfAnswerYouTubeInputSchema";
import { findStartOfAnswerYouTubePrompt } from "./prompts/findStartOfAnswerYouTubePrompt";

export const FIND_START_OF_ANSWER_YOUTUBE = "Find Start Of Answer Cue";

export class FindStartOfAnswerYouTube extends Prompt<
  typeof findStartOfAnswerYouTubeInputSchema,
  typeof findStartOfAnswerYouTubeOutputSchema
> {
  constructor() {
    super({
      name: FIND_START_OF_ANSWER_YOUTUBE,
      description:
        "Find the start of an answer to a question in some transcript cues",
      prompts: [findStartOfAnswerYouTubePrompt],
      model: "gpt-4",
      input: findStartOfAnswerYouTubeInputSchema,
      output: findStartOfAnswerYouTubeOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    question: string;
    cues: { text: string }[];
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: FindStartOfAnswerYouTubeInput = {
      transcript: args.cues
        .map((cue, i) =>
          `
ID: ${i}
${cue.text}
`.trim()
        )
        .join(`\n---\n`),
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

export const findStartOfAnswerYouTube = () => new FindStartOfAnswerYouTube();
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
    const res = await findStartOfAnswerYouTube().execute({
      cues: [],
      question: "How does chain of thought prompting work",
    });
    console.log(res);
  })();
}
