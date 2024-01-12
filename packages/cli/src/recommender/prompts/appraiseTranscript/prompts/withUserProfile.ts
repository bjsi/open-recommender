import { CandidatePrompt } from "prompt-iteration-assistant";
import { AppraiseTranscriptInput } from "../schemas/appraiseTranscriptInputSchema";

export const noTitlePrompt = new CandidatePrompt<AppraiseTranscriptInput>({
  name: "with user profile",
  compile: function () {
    return [
      {
        role: "system",
        content: `
# Instructions
Given a transcript of a video, evaluate whether the video should be recommended to the user. The user wants high quality videos related to their interests. Consider the following characteristics when making your assessment:
- **Use of Buzzwords and Jargon**: Don't recommend videos with an overuse of sensationalist or trendy terms like "revolutionize," "game-changing," "transformative," etc., without substantial context or explanation.
- **Vagueness and Lack of Specific Details**: Don't recommend videos if the transcript lacks specific, concrete information about the topics discussed, and instead uses broad, sweeping statements.
- **Clickbait-style Elements**: Don't recommend the video if the content of the transcript seems designed to attract viewers through sensationalism or exaggerated claims rather than substantive content.
- **Unsubstantiated Claims and Speculation**: Look for bold claims about future technologies or effects without evidence, data, or references to back them up.
- **Overpromising and Excessive Speculation**: Assess whether the transcript makes unrealistic promises about the future or engages in speculation without acknowledging the uncertainty.
- **Related to User's Interests**: Do recommend videos that are strongly related to the user's interests visible from their profile.
- **Appropriate to the User's Knowledge Level**: Take the user's knowledge level into account - don't recommend Python beginner tutorials to an experienced Python developer.

Based on these criteria, provide a one sentence assessment of whether the video should be recommended to the user.
`.trim(),
      },
      {
        role: "user",
        content: `
# User Profile
${this.getVariable("profile")}

# Transcript
${this.getVariable("transcript")}
`.trim(),
      },
    ];
  },
});
