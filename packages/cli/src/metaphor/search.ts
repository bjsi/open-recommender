import Metaphor from "metaphor-node";
import dotenv from "dotenv";
import { youtubeUrlToId } from "shared/src/youtube";

dotenv.config();

const metaphor = new Metaphor(process.env.METAPHOR_API_KEY!);

export interface MetaphorYouTubeResult {
  type: "youtube";
  title: string;
  url: string;
  channelName: string | undefined;
  id: string;
}

export async function searchYouTubeVideos(
  query: string
): Promise<MetaphorYouTubeResult[]> {
  try {
    const response = await metaphor.search(query, {
      numResults: 5,
      includeDomains: ["youtube.com"],
      useAutoprompt: true,
    });
    return response.results
      .filter((x) => !!x.title)
      .map((x) => ({
        type: "youtube" as const,
        title: x.title,
        url: x.url,
        channelName: x.author,
        id: youtubeUrlToId(x.url),
      }))
      .filter((x) => !!x.id) as MetaphorYouTubeResult[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function findSimilarYouTubeVideos(url: string) {
  const response = await metaphor.findSimilar(url, {
    numResults: 10,
  });
}

if (require.main === module) {
  const exampleQueries = [
    "Exploring Language Learning Models and Spaced Repetition Systems",
    "Artificial Intelligence advancements and implications in education",
    "Optimization and evolution in AI: Perspectives of Yann LeCun and Kenneth Stanley",
    "Regulation vs advancement of AI in the UK",
    "How evolutionary algorithms shape AI",
    "Engineering of AI prompts and hypothesis generation",
    "Learning through exploration and problem-solving in programming",
    "Deep dive into TypeScript and its utility in AI applications",
    "Tech innovation in France: A focus on AI and social networks",
    "Human potential and development through AI and technology",
  ];
  const query =
    exampleQueries[Math.floor(Math.random() * exampleQueries.length)];
  console.log("query", query);
  (async () => {
    const results = await searchYouTubeVideos(query);
    console.log(results);
  })();
}
