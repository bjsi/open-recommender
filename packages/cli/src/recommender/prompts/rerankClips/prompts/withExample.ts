import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { RerankClipsInput } from "../schemas/rerankClipsInputSchema";

export const zeroShotPrompt = new CandidatePrompt<RerankClipsInput>({
  name: "zero shot with reasoning",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Order the YouTube video clips based on how interesting they will be to the user.
- Clips are considered interesting based on the quality and novelty of their content as well as if they **directly** mention one or more of the user's interests.
- Clips that are more conceptual in nature are considered more interesting than clips that are more practical or tutorial based.
- You can understand the user's interests by looking at their Tweets and seeing the topics, concepts, events, ideas, problems and people they tweet about.
- Order the clips in descending order of interestingness, starting with the most interesting.
- You must include a sentence of reasoning explaining at least why you chose the top two clips.
`.trim()
      ),
      ChatMessage.user(
        `
Here are my tweets:
# Tweets
${this.getVariable("tweets")}
`.trim()
      ),
      ChatMessage.user(
        `
Here are the clips:
# Clips
${this.getVariable("clips")}       
`.trim()
      ),
    ];
  },
});
