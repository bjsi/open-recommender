import { PyBridge, RemoteController } from "pybridge-zod";
import { z } from "zod";
import { TokenTextSplitter } from "../recommender/textSplitter";
import { Transcript, transcriptToMarkdownCues } from "../youtube/transcript";
import { getTopicFromQuestion } from "../recommender/prompts/getTopicFromQuestion/getTopicFromQuestion";

const RAGChunkSchema = z.object({
  content: z.string(),
  score: z.number(),
  rank: z.number(),
  metadata: z.record(z.any()),
});

export interface RAGInput {
  content: string;
  metadata: Record<string, any>;
}

export type RAGChunk = z.infer<typeof RAGChunkSchema>;

export const RAGAPISchema = z.object({
  rag: z
    .function()
    .args(
      z.object({
        query: z.union([z.string(), z.string().array()]),
        docs: z.array(
          z.object({
            content: z.string(),
            metadata: z.record(z.any()),
          })
        ),
        k: z.number().optional(),
      })
    )
    .returns(RAGChunkSchema.array().array()),
});

export type RAGApi = RemoteController<z.infer<typeof RAGAPISchema>>;

class PythonController {
  api: RAGApi;

  constructor(protected python: PyBridge, filename: string) {
    this.python = python;
    this.api = this.python.controller(filename, RAGAPISchema);
  }
}

export const initLocalRAGApi = () => {
  const bridge = new PyBridge({
    python: "python3",
    cwd: __dirname,
  });
  return {
    api: new PythonController(bridge, "rag.py").api,
    bridge,
  };
};

export const initRemoteRAGApi = () => {
  const bridge = new PyBridge({
    python: "python3",
    cwd: __dirname,
  });
  return {
    api: new PythonController(bridge, "rag-remote.py").api,
    bridge,
  };
};

export const chunkTranscript = async (transcript: Transcript) => {
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
        type: "youtube" as const,
        videoId: transcript.videoId,
        minCueIdx: min,
        maxCueIdx: max,
      },
    };
  });
  return chunks;
};

export interface SearchResultWithScore {
  result: { content: string; metadata: { id: number } };
  score: number;
  rank: number;
}

export const rerankSearchResults = async (args: {
  query: string;
  results: { content: string; metadata: { id: number } }[];
  scoreCutOff: number;
}) => {
  const { api, bridge } = initRemoteRAGApi();
  // This formulates the question into a better format for re-ranking
  const topic = await getTopicFromQuestion().execute({
    question: args.query,
  });
  console.log("Reranking using topic", topic, "for question", args.query);
  if (!topic) {
    throw new Error("Failed to get topic from question");
  }
  const resultsList = await api.rag({
    query: topic,
    docs: args.results,
  });
  bridge.close();
  return resultsList.flat().filter((x) => x.score >= args.scoreCutOff);
};

export interface HighlightMetadata {
  type: "highlight";
  articleId: string;
}

export interface YTMetadata {
  type: "youtube";
  videoId: string;
  minCueIdx: number;
  maxCueIdx: number;
}

export const searchChunks = async <T extends { type: string }>(args: {
  queries: string[];
  chunks: {
    content: string;
    metadata: T;
  }[];
  scoreCutOff: number;
}): Promise<Record<string, RAGChunk[]>> => {
  const { api, bridge } = initRemoteRAGApi();
  const resultsList = await api.rag({
    query: args.queries,
    docs: args.chunks,
    k: 10,
  });
  bridge.close();
  const questionToResults: Record<string, RAGChunk[]> = {};
  for (let i = 0; i < resultsList.length; i++) {
    questionToResults[args.queries[i]] = resultsList[i];
  }
  return questionToResults;
};
