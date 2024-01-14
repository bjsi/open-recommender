import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { RecommendClipsInput } from "../schemas/recommendClipsInputSchema";
import { RECOMMEND_CLIPS } from "../recommendClips";

export const MIN_CLIP_LENGTH = 20; // ~60 seconds
export const MAX_CLIP_LENGTH = 80; // ~4 mins

export const withProfileSummary = new CandidatePrompt<RecommendClipsInput>({
  name: "eacc-example-profile-summary-3",
  compile: function () {
    return [
      ChatMessage.system(
        `
# Instructions
- You are an editor creating YouTube shorts clips from a video transcript.
- You can understand the user's interests by looking at their user profile and seeing the specific topics, concepts, events, ideas, problems and people they are interested in.
- Only create clips that directly mention the user's low-level interests, like "the use of LLMs in recommender systems", as opposed to generic high-level interests like "AI", "technology" and "innovation".
- If the transcript does not **directly** mention one or more of the user's concrete interests, pass an empty array or undefined to the ${toCamelCase(
          RECOMMEND_CLIPS
        )} function.
- Output a maximum of 2 clips.
- Prefer clips that are conceptual in nature over clips that are practical or tutorial based.
- Clips must make sense out of context and be understandable without watching the full video.
- Clips should be between ${MIN_CLIP_LENGTH} and ${MAX_CLIP_LENGTH} transcript cues long.
- Each clip should have a short title that summarizes the clip's content.
- If a clip is created, write a one-sentence reason to the user explaining the connection between the clip and their interests.
`.trim()
      ),
      ChatMessage.user(
        `
# User Profile
"""
${this.getVariable("profile")}
"""

# Video
## Title
${this.getVariable("title")}

## Transcript
"""
${this.getVariable("transcript")}
"""
`.trim()
      ),
    ];
  },
});
