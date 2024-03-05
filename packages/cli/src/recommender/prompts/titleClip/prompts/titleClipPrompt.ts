import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { TitleClipInput } from "../schemas/titleClipInputSchema";

export const titleClipPrompt = new CandidatePrompt<TitleClipInput>({
  name: "main",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Given the text from a clip from a video, give the clip a short title summarizing how the clip answers the question.
`.trim()
      ),
      ChatMessage.user(
        `
# Main Video Title
${this.getVariable("videoTitle")}

# Clip
${this.getVariable("clip")}

# Question
${this.getVariable("question")}
`.trim()
      ),
    ];
  },
});
