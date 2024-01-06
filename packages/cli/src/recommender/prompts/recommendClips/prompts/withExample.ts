import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { RecommendClipsInput } from "../schemas/recommendClipsInputSchema";
import { RecommendClipsOutput } from "../schemas/recommendClipsOutputSchema";
import { eaccDataset } from "../datasets/eacc";
import { RECOMMEND_CLIPS } from "../recommendClips";

export const MIN_CLIP_LENGTH = 10; // ~30 seconds
export const MAX_CLIP_LENGTH = 50; // ~2.5 mins

export const withExamplePrompt = new CandidatePrompt<RecommendClipsInput>({
  name: "eacc-example",
  compile: function () {
    return [
      ChatMessage.system(
        `
# Instructions
- You are an editor creating YouTube shorts clips from a video transcript consisting of a list of transcript cues.
- Your task is to create clips that will be interesting to the user and encourage them to watch the full video.
- You can understand the user's interests by looking at their Tweets and seeing the topics, concepts, events, ideas, problems and people they tweet about.
- Clips are considered interesting if they **directly** mention one or more of the user's interests.
- Only create clips that are strongly related to the user's tweets. In cases where no strongly related clips are found, reply with an empty array.
- Each clip should have at least ${MIN_CLIP_LENGTH} cues and a maximum of ${MAX_CLIP_LENGTH} cues.
- If a clip is created, include a title and a one-sentence explanation highlighting the direct connection to the user's interests. 
`.trim()
      ),
      ChatMessage.user(
        `
Here are my tweets:
# Tweets
${eaccDataset.tweets.value}
`.trim()
      ),
      ChatMessage.user(
        `
# Video
## Title
${eaccDataset.title.value}

## Transcript
${eaccDataset.transcript.value}
`.trim()
      ),
      ChatMessage.assistant<RecommendClipsOutput>(null, {
        name: toCamelCase(RECOMMEND_CLIPS),
        arguments: {
          clips: [
            {
              title:
                "Balancing Forces: Effective Accelerationism in AI and Society",
              reason:
                'Given your engagement with the impact of technology on society and your interest in speculative approaches to AI, as seen in your discussions about "The Three Body Problem," this clip on effective accelerationism will likely resonate with your perspectives on balancing innovation and risk in technological development.',
              startId: 21,
              endId: 60,
            },
          ],
        },
      }),
      ChatMessage.user(
        `
Here are my tweets:
# Tweets
${this.getVariable("tweets")}
`.trim()
      ),
      ChatMessage.user(
        `
# Video
## Title
${this.getVariable("title")}

## Transcript
${this.getVariable("transcript")}
  `.trim()
      ),
    ];
  },
});
