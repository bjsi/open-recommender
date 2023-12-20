import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { RerankClipsInput } from "../schemas/rerankClipsInputSchema";

export const zeroShotPrompt = new CandidatePrompt<RerankClipsInput>({
  name: "zero-shot",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Order the YouTube video clips based on their relevance to the user's interests.
- Clips are considered interesting if they are **directly** related to one or more of the user's interests.
- You can understand the user's interests by looking at their Tweets and seeing the topics, concepts, events, ideas, problems and people they tweet about.
- Order the clips in descending order of relevance, starting with the most relevant.
`.trim()
      ),
      ChatMessage.user(
        `
# Tweets
${this.getVariable("tweets")}
`.trim()
      ),
    ];
  },
});
