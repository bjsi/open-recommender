import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { RerankClipsInput } from "../schemas/rerankClipsInputSchema";

export const zeroShotPromptWithUserProfile =
  new CandidatePrompt<RerankClipsInput>({
    name: "zero shot with reasoning and user profile",
    compile() {
      return [
        ChatMessage.system(
          `
# Instructions
- Order the YouTube video clips based on how interesting they will be to the user.
- Clips are considered interesting based on the quality and novelty of their content as well as if they **directly** mention one or more of the user's interests.
- You can understand the user's interests by looking at their Tweets and seeing the topics, concepts, events, ideas, problems and people they tweet about.
- Also consider the user's background and expertise when evaluating the clips - eg. a Python tutorial for beginners will not be interesting to an experienced Python developer.
- Clips that are more conceptual in nature are considered more interesting than clips that are more practical or tutorial based.
- Order the clips in descending order of interestingness, starting with the most interesting.
- You must include a sentence of reasoning explaining at least why you chose the top two clips.
`.trim()
        ),
        ChatMessage.user(
          `
# User Profile
${this.getVariable("profile")}

# Clips
${this.getVariable("clips")}       
`.trim()
        ),
      ];
    },
  });
