import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { FilterIrrelevantTweetsInput } from "../schemas/filterIrrelevantTweetsInputSchema";

export const zeroShot = new CandidatePrompt<FilterIrrelevantTweetsInput>({
  name: "zero-shot",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Act as a tweet classifier.
- Classify each tweet as relevant or irrelevant based on whether it shows what the user is interested in.
- If you are unsure, include the tweet.
- Return a list of relevant tweetIDs.
`.trim()
      ),
      {
        role: "user",
        content: `
# Tweets
${this.getVariable("tweets")}
`.trim(),
      },
    ];
  },
});
