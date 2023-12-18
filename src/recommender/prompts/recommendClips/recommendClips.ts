import { Prompt } from "prompt-iteration-assistant";
import { recommendClipsInputSchema } from "./schemas/recommendClipsInputSchema";
import { withExamplePrompt } from "./prompts/withExample";
import { recommendClipsOutputSchema } from "./schemas/recommendClipsOutputSchema";
import { unrelatedDataset1 } from "./datasets/unrelated1";
import { unrelatedDataset2 } from "./datasets/unrelated2";
import { relatedDataset } from "./datasets/related";
import { search } from "../../../youtube/search";
import { searchList } from "../../../dialogs/actions";
import {
  TranscriptCue,
  fetchTranscript,
  transcriptCuesToVtt,
  transcriptToMarkdownCues,
} from "../../../youtube/transcript";
import { splitTranscript } from "./helpers/splitTranscript";
import { program } from "commander";
import {
  loadExampleTweetHistory,
  tweetsToString,
} from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import { Tweet } from "../../../twitter/schemas";
import { TranscriptChunk } from "./helpers/transcriptClip";

export const RECOMMEND_CLIPS = "Recommend Clips";

class RecommendClipsPrompt extends Prompt<
  typeof recommendClipsInputSchema,
  typeof recommendClipsOutputSchema
> {
  constructor() {
    super({
      name: RECOMMEND_CLIPS,
      description:
        "Recommend relevant clips from a transcript to the user based on their interests.",
      prompts: [withExamplePrompt],
      model: "gpt-4",
      input: recommendClipsInputSchema,
      output: recommendClipsOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    enableOpenPipeLogging?: boolean;
    user: string;
    tweets: Tweet[];
    transcript: TranscriptCue[];
    title: string;
    url: string;
    verbose?: boolean;
  }) {
    const text = transcriptCuesToVtt(args.transcript);
    const parts = await splitTranscript({ text });
    const chunks: TranscriptChunk[] = [];
    for (const part of parts) {
      const promptVariables = {
        tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        transcript: part,
        title: args.title,
      };
      if (!args.enableOpenPipeLogging) {
        const { clips } = await this.run({
          promptVariables,
          stream: false,
          verbose: args.verbose,
        });
        chunks.push(...(clips || []));
      } else {
        const { clips } = await openpipe.functionCall({
          input: this.input!,
          output: this.output!,
          vars: promptVariables,
          prompt: this.prompts[0],
          body: {
            max_tokens: this.max_tokens,
            temperature: this.temperature,
            model: this.model,
          },
        });
        chunks.push(...(clips || []));
      }
    }
    return chunks;
  }
}

/**
 * We extract clips from the transcript based on the user's tweets.
 * We could use YouTube's chapters, but they are not always available, accurate or granular enough.
 */
export const recommendClips = () =>
  new RecommendClipsPrompt()
    .withTest("medium related", {
      tweets: unrelatedDataset1.tweets.value,
      title: unrelatedDataset1.title.value,
      transcript: unrelatedDataset1.transcript.value,
    })
    .withTest(
      "unrelated",
      {
        tweets: unrelatedDataset2.tweets.value,
        title: unrelatedDataset2.title.value,
        transcript: unrelatedDataset2.transcript.value,
      },
      (output) => {
        const clips = output.clips || [];
        return {
          score: clips.length === 0 ? 1 : 0,
          reason: "",
          pass: clips.length === 0,
        };
      }
    )
    .withTest("strongly related", {
      tweets: relatedDataset.tweets.value,
      title: relatedDataset.title.value,
      transcript: relatedDataset.transcript.value,
    });

if (require.main === module) {
  (async () => {
    const p = program
      .option("-u, --user <user>", "user name")
      .option("-q, --query <query>", "query string");

    const command = p.parse(process.argv);
    const user = command.opts().user;
    const query = command.opts().query;
    if (!user) {
      console.error("User required");
      process.exit(1);
    }
    if (!query) {
      console.error("Query required");
      process.exit(1);
    }

    // get tweets from user
    const tweets = loadExampleTweetHistory(user).slice(0, 20);
    if (!tweets || tweets.length === 0) {
      console.error("Failed to fetch tweets for", user);
      process.exit(1);
    }

    const tweetsStr = tweetsToString({ tweets, user });

    console.log("Searching for videos...");
    const results = await search({ query });
    const videoTitle = await searchList({
      message: "Pick a video:",
      choices: results.map((r) => r.title),
    });
    const chosenVideo = results.find((r) => r.title === videoTitle);
    if (!chosenVideo) {
      console.error("Invalid video");
      process.exit(1);
    }
    const transcript = await fetchTranscript(chosenVideo.id, chosenVideo.title);
    if (!transcript) {
      console.error("Failed to fetch transcript");
      process.exit(1);
    }

    const allClips = [];
    const parts = await splitTranscript({
      text: transcriptToMarkdownCues(transcript?.cues || []),
      separators: ["---"],
    });
    for (const part of parts) {
      const { clips } = await recommendClips().run({
        promptVariables: {
          tweets: tweetsStr,
          title: chosenVideo.title,
          transcript: part,
        },
        stream: false,
      });
      allClips.push(...(clips || []));
    }
    console.log("Recommended clips:");
    console.log(allClips);
  })();
}
