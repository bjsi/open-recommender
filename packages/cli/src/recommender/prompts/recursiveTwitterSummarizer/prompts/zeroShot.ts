import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { RecursiveTwitterSummarizerInput } from "../schemas/recursiveTwitterSummarizerInputSchema";

export const zeroShot = new CandidatePrompt<RecursiveTwitterSummarizerInput>({
  name: "zero-shot-3",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Act as a user interests summarizer.
- Look at the user's Twitter data and summaries of their tweets and summarize their interests into a profile that explains what topics, people, concepts and ideas interest them.
- Focus on specific low-level interests, like "the use of LLMs in recommender systems", as opposed to generic high-level interests like "AI", "technology" and "innovation".
- You must include any technical terms and names of people, places, and things that are relevant to the user.
- Do not add your own explanations of abbreviations or acronyms, just include them.
- If summarizing existing summaries, do not exclude any of the technical terms and names of concepts, people, places, ideas and events that are relevant to the user.
- The summary string should be JSON parsable (escaped quotes, etc).
- Write a two paragraph summary of around 500 words.
`.trim()
      ),
      {
        role: "user",
        content: `
# Username
${this.getVariable("user")}

# Bio
${this.getVariable("bio")}

# Tweets or Summaries
${this.getVariable("tweets")}
`.trim(),
      },
    ];
  },
});
