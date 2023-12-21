import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { recommendClipsInputSchema } from "../schemas/recommendClipsInputSchema";
import { z } from "zod";
import { recommendClipsOutputSchema } from "../schemas/recommendClipsOutputSchema";
import { eaccDataset } from "../datasets/eacc";

export const withExamplePrompt = new CandidatePrompt<
  z.infer<typeof recommendClipsInputSchema>
>({
  name: "eacc-example",
  compile: function () {
    return [
      ChatMessage.system(
        `
# Instructions
- You are a YouTube video recommender.
- You are shown a transcript of a video consisting of a list of transcript cues.
- Your task is to recommend clips from the transcript that will be interesting to a user based on their interests.
- Each clip 
- Transcript clips are considered interesting if they **directly** mention one or more of the user's interests.
- You can understand the user's interests by looking at their Tweets and seeing the topics, concepts, events, ideas, problems and people they tweet about.
- Only create clips that are strongly related to the user's tweets. In cases where no strongly related clips are found, reply with an empty array.
- If a clip is created, include a title and a one-sentence explanation highlighting the direct connection to the user's interests. 
`.trim()
      ),
      ChatMessage.user(
        `
# Tweets
${eaccDataset.tweets.value}
# Video Title
${eaccDataset.title.value}
# Video Transcript
${eaccDataset.transcript.value}
`.trim()
      ),
      ChatMessage.assistant(null, {
        name: "createClips",
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
        } satisfies z.infer<typeof recommendClipsOutputSchema>,
      }),
      {
        role: "user",
        content: `
# Tweets
${this.getVariable("tweets")}
# Video
## Title
${this.getVariable("title")}
## Transcript
${this.getVariable("transcript")}
  `.trim(),
      },
    ];
  },
});
