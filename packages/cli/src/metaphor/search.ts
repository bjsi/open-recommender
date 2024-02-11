import Exa from "exa-js";
import dotenv from "dotenv";
import { youtubeUrlToId } from "shared/src/youtube";
import { compact } from "remeda";
import { nearestSubstring } from "./nearestSubstring";
import { YouTubeResult } from "../youtube/search";
import { Transcript } from "../youtube/transcript";

dotenv.config();

const metaphor = new Exa(process.env.METAPHOR_API_KEY!);

export interface MetaphorYouTubeResult {
  metaphorId: string;
  type: "youtube";
  source: "metaphor";
  title: string;
  url: string;
  channelName: string | undefined;
  id: string;
}

export interface MetaphorArticleResult {
  metaphorId: string;
  id: string;
  source: "metaphor";
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
export type VideoResult = MetaphorYouTubeResult | YouTubeResult;
export type VideoResultWithTranscript = VideoResult & {
  transcript: Transcript;
};

export async function searchYouTube(args: {
  query: string;
  numResults?: number;
}): Promise<MetaphorYouTubeResult[]> {
  const response = await metaphor.search(args.query, {
    numResults: args.numResults || 5,
    useAutoprompt: true,
    includeDomains: ["youtube.com"],
  });
  return compact(
    response.results
      .filter((x) => !!x.title)
      .map((x) => {
        const ytId = youtubeUrlToId(x.url);
        return !ytId || !x.title
          ? null
          : {
              source: "metaphor",
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
    excludeDomains: ["youtube.com"],
  });

  return compact(
    response.results.map((res) => {
      if (!res.title) {
        return null;
      }
      return {
        source: "metaphor",
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
    const results = await searchNonYouTube({ query, numResults: 10 });
    const fst = results[0];
    console.log(fst.text);

    for (const highlight of fst.highlights) {
      const idx = fst.text.indexOf(highlight.text);
      if (idx === -1) {
        console.log("naive substring search failed");
      }
      const res = nearestSubstring(highlight.text, fst.text);
      if (res.bestStartIdx === -1) {
        console.log("nearest substring search failed");
      } else {
        console.log("substring search results", res);
      }
    }
  })();
}
