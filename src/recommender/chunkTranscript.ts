import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Prompt } from "./prompt";
import OpenAI from "openai";
import { learningVideoTranscript } from "./tests/exampleData";
import dotenv from "dotenv";
import { RecursiveCharacterTextSplitter } from "./textSplitter";
import { tokenize } from "../tokenize";
import { transcriptCuesToVtt } from "../youtube/transcript";
import dayjs from "dayjs";

/**
 * We chunk the transcript into logical sections and add metadata using an LLM.
 * We could use YouTube's chapters, but they are not always available, accurate or granular enough.
 */

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
# Instructions
- You are a YouTube video editor creating 45-90 second clips from a video transcript that will be interesting to a user based on their Twitter feed.
- Analyze the user's tweets, identifying key themes, topics and people they are interested in and extract relevant sections from the video transcript.
- Only extract clips that are **directly** related to the user's interests.
- If there are no directly relevant clips, you should output an empty array.
- Include a title and one sentence summary of each section focusing on why it will be interesting to the user.
`.trim(),
  },
  {
    role: "user",
    content: `
# Tweets   
@experilearning (2023-11-07)
Experimenting with creating a AI journalling assistant rn. Getting the RAG/chat memory right is the most important part. Here's the approach that got the best results so far:
- take each paragraph
- add metadata using gpt (emotions mentioned, people mentioned, topics mentioned)
- for each theme (emotion/topic/person) take all paragraphs mentioning that theme and summarise using GPT
- when writing a new journal entry, extract themes (emotions/topics/people), then include all the summaries for those themes and get the AI to question you
It feels way better than naive RAG. Obviously it's more work, more expensive and you end up having to keep doing LLM calls to update the summaries over time, but I think it's worth it.
# Video
## Title
Advanced RAG 01 - Self Querying Retrieval
## Transcript
WEBVTT
Kind: captions
Language: en

00:00:00.050 --> 00:00:00.350
Okay.

00:00:00.350 --> 00:00:03.859
So in this video, I'm going to address
one of the biggest issues that I

00:00:03.859 --> 00:00:10.290
see people having problems with in
relation to building RAG systems or

00:00:10.290 --> 00:00:12.810
retrieval augmented generation systems.

00:00:13.210 --> 00:00:16.840
and that is that they try to use
semantic search for everything.

00:00:17.120 --> 00:00:21.620
you only want to use semantic search where
it makes sense to use semantic search.

00:00:21.980 --> 00:00:25.449
If you're doing search on things
that would be the kind of things

00:00:25.449 --> 00:00:29.680
that are in a normal database that
you would just look up an integer,

00:00:29.710 --> 00:00:31.359
look up a string, that kind of thing.

00:00:31.690 --> 00:00:35.050
You actually don't want to use
those for doing semantic search.

00:00:35.050 --> 00:00:39.199
You want to do semantic search where
you've got text that you're trying to

00:00:39.199 --> 00:00:41.419
extract semantic, meaning out of that.

00:00:41.773 --> 00:00:46.693
So this brings us to the whole
concept of self querying retrieval.

00:00:47.143 --> 00:00:51.883
if we look at the diagram for this,
we can see that the idea here is that.

00:00:52.303 --> 00:00:57.493
We have a sort of step between
the retrieval and the input.

00:00:57.543 --> 00:00:59.283
So the person types in their query.

00:00:59.773 --> 00:01:04.033
and then we use a large language
model to reformat that query to get

00:01:04.083 --> 00:01:09.303
both the semantic elements of that,
but also to be able to convert it

00:01:09.393 --> 00:01:13.623
so that we can actually do searches
on metadata as we go through this.

00:01:13.923 --> 00:01:19.043
So this is a fundamental fact that
if you're looking for a movie and you

00:01:19.043 --> 00:01:23.573
want to basically specify the year, you
don't want to look for the year using

00:01:23.573 --> 00:01:25.343
a vector store in semantic search.

00:01:25.343 --> 00:01:29.163
You want to basically just do a
lookup that looks at the year and

00:01:29.163 --> 00:01:32.943
filters the results back based
on that year that you put in.

00:01:33.243 --> 00:01:38.943
Just the same if you were doing something
for doing searches on Spotify or doing

00:01:38.943 --> 00:01:42.613
such as with music, if the person
gives you the name of the artist,

00:01:42.613 --> 00:01:45.973
you don't want to use semantic search
to look up the name of the artist.

00:01:46.213 --> 00:01:51.233
You want to do a query that looks for
that artists and then uses the semantic

00:01:51.233 --> 00:01:55.293
search for doing the parts where semantic
search is actually strong in this.

00:01:55.443 --> 00:01:57.613
So let's jump in, have a
look at this in LangChain.

00:01:57.633 --> 00:02:00.813
So we're going to be using the
self querying retriever here.

00:02:01.233 --> 00:02:05.253
now I'm using OpenAI embeddings
and the OpenAI models.

00:02:05.503 --> 00:02:09.506
you can swap out, these for,
you know, the other models like

00:02:09.506 --> 00:02:11.276
I've done in many videos before.

00:02:11.486 --> 00:02:15.336
And maybe at some point I'll do an
end-to-end example of building an app with

00:02:15.336 --> 00:02:18.976
this using LLaMA-2 and say BGE embeddings.

00:02:19.196 --> 00:02:21.776
I've just gone for these cause
so that these parts are not

00:02:21.776 --> 00:02:22.886
the important part in here.

00:02:23.126 --> 00:02:24.836
And the code doesn't
take up too much room.

00:02:25.136 --> 00:02:28.986
So I'm using chroma as
my vector store in here.

00:02:29.143 --> 00:02:31.363
like I said, I'm using
the OpenAI embeddings.
`.trim(),
  },
  {
    role: "assistant",
    content: null,
    function_call: {
      name: "createClips",
      arguments: JSON.stringify({
        clips: [
          {
            title: "Enhancing AI Retrieval with Self-Querying Techniques",
            summary:
              "This clip offers insightful strategies on using self-querying retrieval to improve the efficiency and accuracy of AI systems in parsing and summarizing complex data, directly applicable to your AI journaling project.",
            start: "00:00:47",
            end: "00:01:55",
          },
        ],
      } satisfies z.infer<typeof outputSchema>),
    },
  },
  {
    role: "user",
    content: `
# Tweets
{{ tweets }}
# Video
## Title
{{ title }}
## Transcript
{{ transcript }}
  `.trim(),
  },
];

const inputSchema = z.object({
  transcript: z.string(),
  title: z.string(),
  tweets: z.string(),
});

export type ChunkTranscriptVars = z.infer<typeof inputSchema>;

const clipSchema = z.object({
  title: z.string(),
  summary: z.string().describe("A one sentence summary of the section."),
  start: z.string(), // TODO: format?
  end: z.string(), // TODO: format?
});

export type TranscriptChunk = z.infer<typeof clipSchema>;

export interface TranscriptClip {
  title: string;
  summary: string;
  start: number; // seconds
  end: number; // seconds
  videoTitle: string;
  videoUrl: string; // with timestamp
  videoId: string;
}

export const hhmmssToSeconds = (hhmmss: string) => {
  const [hours, minutes, seconds] = hhmmss.split(":");
  return (
    parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) * 1
  );
};

export const chunkToClip = (args: {
  chunk: TranscriptChunk;
  videoTitle: string;
  videoId: string;
}): TranscriptClip => {
  const { chunk, videoId, videoTitle } = args;
  return {
    title: chunk.title,
    summary: chunk.summary,
    start: hhmmssToSeconds(chunk.start),
    end: hhmmssToSeconds(chunk.end),
    videoTitle: videoTitle,
    videoId: videoId,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}&t=${hhmmssToSeconds(
      chunk.start
    )}s`,
  };
};

const outputSchema = z.object({
  clips: z.array(clipSchema),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "createClips",
  description: "Extract clips from a video based on the user's interests.",
  parameters: zodToJsonSchema(outputSchema),
};

export const chunkTranscript = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-4",
  inputSchema,
});

export const splitTranscript = async (text: string) => {
  const parts = await new RecursiveCharacterTextSplitter({
    chunkSize: 2000 * 4,
    chunkOverlap: 200, // not sure if this is necessary
  }).splitText(text);
  return parts;
};

if (require.main === module) {
  (async () => {
    dotenv.config();
    const webvttText = transcriptCuesToVtt(learningVideoTranscript.cues);
    const parts = await splitTranscript(webvttText);
    const clips: TranscriptClip[] = [];
    for (const part of parts) {
      const chunks = await chunkTranscript.run({
        promptVars: {
          transcript: part,
          title: learningVideoTranscript.videoTitle,
          tweets:
            "I'm interested in critiques of the traditional education system.",
        },
      });
      clips.push(
        ...chunks.clips.map((clip) => ({
          ...clip,
          start: hhmmssToSeconds(clip.start),
          end: hhmmssToSeconds(clip.end),
          videoId: learningVideoTranscript.videoId,
          videoTitle: learningVideoTranscript.videoTitle,
          videoUrl: `https://www.youtube.com/watch?v=${learningVideoTranscript.videoId}&t=${clip.start}s`,
        }))
      );
    }
    console.log(JSON.stringify(clips, null, 2));
  })();
}
