import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { RecursiveTwitterSummarizerInput } from "../schemas/recursiveTwitterSummarizerInputSchema";

export const zeroShot = new CandidatePrompt<RecursiveTwitterSummarizerInput>({
  name: "zero-shot",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Act as a user interests summarizer.
- Look at the user's Twitter data and summaries of their tweets and summarize their interests into a summary that explains what topics, people, concepts and ideas interest them.
- You must include any technical terms and names of people, places, and things that are relevant to the user.
- If summarizing existing summaries, do not exclude any of the technical terms and names of people, places, and things that are relevant to the user.
- Write a two paragraph summary of around 400 words.
`.trim()
      ),
      {
        role: "user",
        content: `
# Username
${this.getVariable("user")}

# Twitter Bio
${this.getVariable("bio")}

# Tweets or Summaries
${this.getVariable("tweets")}
`.trim(),
      },
    ];
  },
});
