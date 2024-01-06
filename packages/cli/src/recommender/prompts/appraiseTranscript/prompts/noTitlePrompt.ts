import { CandidatePrompt } from "prompt-iteration-assistant";
import { AppraiseTranscriptInput } from "../schemas/appraiseTranscriptInputSchema";

export const noTitlePrompt = new CandidatePrompt<AppraiseTranscriptInput>({
  name: "transcript but no title",
  compile: function () {
    return [
      {
        role: "system",
        content: `
# Instructions
Given a transcript of a video, evaluate whether the video is likely to be a low-quality video. Consider the following characteristics when making your assessment:
- **Use of Buzzwords and Jargon**: Look for an overuse of sensationalist or trendy terms like "revolutionize," "game-changing," "transformative," etc., without substantial context or explanation.
- **Vagueness and Lack of Specific Details**: Identify if the transcript lacks specific, concrete information about the topics discussed, and instead uses broad, sweeping statements.
- **Clickbait-style Elements**: Determine if the content of the transcript seems designed to attract viewers through sensationalism or exaggerated claims rather than substantive content.
- **Unsubstantiated Claims and Speculation**: Look for bold claims about future technologies or effects without evidence, data, or references to back them up.
- **Overpromising and Excessive Speculation**: Assess whether the transcript makes unrealistic promises about the future or engages in speculation without acknowledging the uncertainty.

Based on these criteria, provide a one sentence assessment of whether the video should be recommended to the user.
`.trim(),
      },
      {
        role: "user",
        content: `
# Transcript
${this.getVariable("transcript")}
`.trim(),
      },
    ];
  },
});
