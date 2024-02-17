import { execSync } from "child_process";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { z } from "zod";
import { writeFileSync } from "fs";
import { tryParseJSON } from "../utils";
import { rerankSearchResults } from "../rag/rag";

dotenv.config();

const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  description: z.string(),
  channel_id: z.string(),
  channel_url: z.string(),
  duration: z.number().nullish(),
  view_count: z.number(),
  average_rating: z.any(),
  categories: z.array(z.string()).nullish(),
  tags: z.string().array().nullish(),
  comment_count: z.number().nullish(),
  chapters: z
    .array(
      z.object({
        start_time: z.number(),
        title: z.string(),
        end_time: z.number(),
      })
    )
    .nullish(),
  like_count: z.number().nullish(),
  channel: z.string(),
  channel_follower_count: z.number().nullish(),
  upload_date: z.string(),
  playlist: z.string(),
  playlist_id: z.string(),
  display_id: z.string(),
  fulltitle: z.string(),
  language: z.string().nullish(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

const formatChapters = (chapters: SearchResult["chapters"]) => {
  return chapters?.map((c, idx) => idx + 1 + ". " + c.title).join("\n");
};

export const formatSearchResult = (
  result: SearchResult & { score?: number; rank?: number }
) => {
  return `
Title: ${result.title}
Channel: ${result.channel}
Views: ${result.view_count}
Duration: ${dayjs()
    .startOf("day")
    .second(result.duration || 0)
    .format("H:mm:ss")}
Chapters:
${formatChapters(result.chapters || [])}
${result.score != null ? `Score: ${result.score}` : ""}
${result.rank != null ? `Rank: ${result.rank}` : ""}
`.trim();
};

interface YouTubeSearchArgs {
  query: string;
  randomlyAppendTerms?: string[];
  n_results?: number;
}

const pickRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export interface YouTubeResult {
  type: "youtube";
  source: "youtube";
  title: string;
  url: string;
  channelName: string;
  id: string;

  score: number;
  rank: number;
}

export async function search(
  args: YouTubeSearchArgs
): Promise<YouTubeResult[]> {
  const searchCommand = `yt-dlp "ytsearch${args.n_results || 5}:${
    args.query +
    (args.randomlyAppendTerms ? " " + pickRandom(args.randomlyAppendTerms) : "")
  }" --dump-json`;
  const rawOutput = execSync(searchCommand, {
    maxBuffer: 10 * 1024 * 1024, // 10 MB
  })
    .toString()
    .trim()
    .split("\n");
  const results = rawOutput
    .map((line) => searchResultSchema.safeParse(tryParseJSON(line)))
    .map((r) => (r.success ? r.data : undefined))
    .filter(Boolean) as SearchResult[];

  if (results.length === 0) {
    return [];
  } else {
    const ranked = await rerankSearchResults({
      query: args.query,
      results: results.map((x, idx) => ({
        content: `${x.title}\n${formatChapters(x.chapters || [])}`,
        metadata: { id: idx },
      })),
      scoreCutOff: 19,
    });
    return ranked.map((x) => ({
      title: results[x.metadata.id].title,
      type: "youtube",
      source: "youtube",
      id: results[x.metadata.id].id,
      channelName: results[x.metadata.id].channel,
      url: `https://www.youtube.com/watch?v=${results[x.metadata.id].id}`,
      score: x.score,
      rank: x.rank,
    }));
  }
}

if (require.main === module) {
  (async () => {
    const query = process.argv[2];
    const n_results = Number.parseInt(process.argv[3]) || 3;
    if (!query) {
      console.error("Please provide a query");
      process.exit(1);
    }
    const results = await search({ query, n_results });
    writeFileSync("searchResults.json", JSON.stringify(results, null, 2));
    console.log(results);
  })();
}
