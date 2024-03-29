import { Prompt } from "prompt-iteration-assistant";
import { RequestTagsWithoutName } from "../../../openpipe/requestTags";
import { findStartOfAnswerYouTubeOutputSchema } from "./schemas/findStartOfAnswerYouTubeOutputSchema";
import {
  FindStartOfAnswerYouTubeInput,
  findStartOfAnswerYouTubeInputSchema,
} from "./schemas/findStartOfAnswerYouTubeInputSchema";
import { findStartOfAnswerYouTubePrompt } from "./prompts/findStartOfAnswerYouTubePrompt";
import { DefaultRun } from "modelfusion";

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
      model: "gpt-3.5-turbo",
      input: findStartOfAnswerYouTubeInputSchema,
      output: findStartOfAnswerYouTubeOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    question: string;
    cues: { text: string }[];
    run?: DefaultRun;
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
    try {
      return this.run({
        stream: false,
        promptVariables,
        run: args.run,
      });
    } catch (e) {
      console.error(e);
      return { cueId: null };
    }
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
