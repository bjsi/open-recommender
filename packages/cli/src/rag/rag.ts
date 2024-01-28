import { PyBridge, RemoteController } from "pybridge-zod";
import { z } from "zod";
import { TokenTextSplitter } from "../recommender/textSplitter";
import {
  Transcript,
  transcriptToMarkdownCues,
  transcriptToString,
} from "../youtube/transcript";
import { TranscriptClipWithScore } from "../recommender/prompts/recommendClips/helpers/transcriptClip";
import { last } from "remeda";
import { youtubeUrlWithTimestamp } from "shared/src/youtube";

const metadata = z.object({
  videoId: z.string(),
  minCueIdx: z.number(),
  maxCueIdx: z.number(),
});

export const RAGAPISchema = z.object({
  rag: z
    .function()
    .args(
      z.object({
        query: z.union([z.string(), z.string().array()]),
        docs: z.array(
          z.object({
            content: z.string(),
            metadata,
          })
        ),
        k: z.number(),
      })
    )
    .returns(
      z
        .object({
          content: z.string(),
          score: z.number(),
          rank: z.number(),
          metadata,
        })
        .array()
        .array()
    ),
});

export type RAGApi = RemoteController<z.infer<typeof RAGAPISchema>>;

class PythonController {
  api: RAGApi;

  constructor(protected python: PyBridge) {
    this.python = python;
    this.api = this.python.controller("rag.py", RAGAPISchema);
  }
}

export const initRAGApi = () => {
  const bridge = new PyBridge({
    python: "python3",
    cwd: __dirname,
  });
  return {
    api: new PythonController(bridge).api,
    bridge,
  };
};

const chunkTranscript = async (transcript: Transcript) => {
  const chunks = (
    await new TokenTextSplitter({
      encodingName: "cl100k_base",
      // works out lower ~300 tokens because we strip out IDs
      chunkSize: 550,
      chunkOverlap: 100,
    }).splitText(transcriptToMarkdownCues(transcript.cues, "\n"))
  ).map((chunk) => {
    const idMatches = chunk.matchAll(/ID: (\d+)\n/g);
    const allIds = [...idMatches].map((match) => parseInt(match[1]));
    const min = Math.min(...allIds);
    const max = Math.max(...allIds);
    return {
      content: chunk.replace(/ID: \d+/g, "").replace(/\n+/g, " "),
      metadata: {
        videoId: transcript.videoId,
        minCueIdx: min,
        maxCueIdx: max,
      },
    };
  });
  return chunks;
};

export const searchTranscripts = async (args: {
  queries: string[];
  transcripts: Transcript[];
  scoreCutOff: number;
}): Promise<Record<string, TranscriptClipWithScore[]>> => {
  const { api, bridge } = initRAGApi();
  const chunks = (
    await Promise.all(
      args.transcripts.flatMap((transcript) => chunkTranscript(transcript))
    )
  ).flat();
  const resultsList = await api.rag({
    query: args.queries,
    docs: chunks,
    k: 5,
  });
  bridge.close();
  const transcriptClips: Record<string, TranscriptClipWithScore[]> = {};
  for (let i = 0; i < resultsList.length; i++) {
    const question = args.queries[i];
    const results = resultsList[i];
    for (const result of results) {
      if (result.score < args.scoreCutOff) {
        continue;
      }
      const transcript = args.transcripts.find(
        (x) => x.videoId === result.metadata.videoId
      );
      if (!transcript) {
        continue;
      }
      const cues = transcript.cues.slice(
        result.metadata.minCueIdx,
        result.metadata.maxCueIdx
      );
      if (!transcriptClips[question]) {
        transcriptClips[question] = [];
      }
      transcriptClips[question].push({
        title: question,
        summary: "",
        start: cues[0].start,
        end: last(cues)!.end,
        videoTitle: transcript.videoTitle,
        videoUrl: youtubeUrlWithTimestamp(transcript.videoId, cues[0].start),
        videoId: transcript.videoId,
        text: transcriptToString(cues),
        score: result.score,
        rank: result.rank,
      });
    }
  }
  return transcriptClips;
};

// export const searchArticles = async (args: {
//   queries: string[];
//   articles: string[];
// }) => {
//   const { api, bridge } = initRAGApi();
//   const results = await api.rag({
//     query: "How does chain of thought prompting work?",
//     docs: args.articles.map((article, idx) => ({
//       content: article,
//       id: idx,
//     })),
//     k: 5,
//   });
//   console.log(results);
//   bridge.close();
// };
