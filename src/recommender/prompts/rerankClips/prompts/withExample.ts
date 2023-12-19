import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { RerankClipsInput } from "../schemas/rerankClipsInputSchema";

export const zeroShotPrompt = new CandidatePrompt<RerankClipsInput>({
  name: "zero-shot",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Order the clips based on their relevance to the user's interests.
- Clips are considered moderately relevant if they mention one more of the user's interests.
- Clips are considered more relevant if they mention multiple of the user's interests.
- Clips are considered less relevant if they mention none of the user's interests.
- Clips are considered extremely relevant if they solve a problem the user has.
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
