import Exa from "exa-js";
import dotenv from "dotenv";
import { youtubeUrlToId } from "shared/src/youtube";
import { compact } from "remeda";

dotenv.config();

const metaphor = new Exa(process.env.METAPHOR_API_KEY!);

export interface MetaphorYouTubeResult {
  metaphorId: string;
  type: "youtube";
  title: string;
  url: string;
  channelName: string | undefined;
  id: string;
}

interface MetaphorArticleResult {
  metaphorId: string;
  id: string;
  type: "article";
  title: string;
  url: string;
  highlights: {
    text: string;
    score: number;
  }[];
  text: string;
}

export type MetaphorResult = MetaphorYouTubeResult | MetaphorArticleResult;

export async function searchYouTube(args: {
  query: string;
  numResults?: number;
}): Promise<MetaphorYouTubeResult[]> {
  const response = await metaphor.search(args.query, {
    numResults: args.numResults || 5,
    useAutoprompt: true,
    includeDomains: ["youtube.com"],
  });
  console.log("metaphor response", response);
  return compact(
    response.results
      .filter((x) => !!x.title)
      .map((x) => {
        const ytId = youtubeUrlToId(x.url);
        return !ytId || !x.title
          ? null
          : {
              metaphorId: x.id,
              type: "youtube" as const,
              title: x.title,
              url: x.url,
              channelName: x.author,
              id: ytId,
            };
      })
  );
}

export async function searchNonYouTube(args: {
  query: string;
  numResults?: number;
}): Promise<MetaphorArticleResult[]> {
  const response = await metaphor.searchAndContents(args.query, {
    numResults: args.numResults || 5,
    useAutoprompt: true,
    highlights: {
      numSentences: 10,
      highlightsPerUrl: 3,
    },
    text: {
      includeHtmlTags: false,
    },
  });

  return compact(
    response.results.map((res) => {
      if (!res.title) {
        return null;
      }
      return {
        metaphorId: res.id,
        id: res.id,
        type: "article",
        title: res.title,
        url: res.url,
        highlights: res.highlights.map((highlight, idx) => ({
          text: highlight,
          score: res.highlightScores[idx],
        })),
        text: res.text,
      };
    })
  );
}

export async function getYouTubeTranscriptMetaphor(id: string) {
  const response = await metaphor.getContents(id, { text: true });
  return response;
}

export async function findSimilarYouTubeVideos(url: string) {
  const response = await metaphor.findSimilar(url, {
    numResults: 10,
  });
  return response;
}

if (require.main === module) {
  const exampleQueries = [
    "Integrating LLMs in Open Recommender Systems",
    "Advanced methods in debugging LLM powered recommender systems",
    "Optimizing pipeline abstraction in LLMs",
    "Content filtering using LLMs for personalized learning experiences",
    "The application of AI in digital education and lifelong learning",
    "Understanding the role of LLMs in app development workflows",
    "Exploring the contribution of LLMs in crafting personalized content feeds",
    "Key advancements in Spaced Repetition Systems (SRS) and their integration with LLMs",
    "Chain of Thought (CoT) and Tree of thought (ToT) prompt styles in effective learning models",
    "Evolution and applications of AI in meal preparation and grocery shopping",
  ];
  const query =
    "What are large language model agents and when were they created?";
  // exampleQueries[Math.floor(Math.random() * exampleQueries.length)];
  console.log("query", query);
  (async () => {
    console.log(
      JSON.stringify(await searchYouTube({ query, numResults: 10 }), null, 2)
    );
  })();
}
