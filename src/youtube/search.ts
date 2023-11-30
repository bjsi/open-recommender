import { execSync } from "child_process";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { z } from "zod";
import { writeFileSync } from "fs";

dotenv.config();

const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  description: z.string(),
  channel_id: z.string(),
  channel_url: z.string(),
  duration: z.number(),
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

export const formatSearchResult = (result: SearchResult) => {
  return `
Title: ${result.title}
Channel: ${result.channel}
Views: ${result.view_count}
Duration: ${dayjs().startOf("day").second(result.duration).format("H:mm:ss")}
Chapters:
${result.chapters?.map((c, idx) => idx + 1 + ". " + c.title).join("\n")}
`.trim();
};

interface YouTubeSearchArgs {
  query: string;
  randomlyAppendTerms?: string[];
  n_results?: number;
}

const pickRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export async function search(args: YouTubeSearchArgs): Promise<SearchResult[]> {
  const searchCommand = `yt-dlp "ytsearch${args.n_results || 3}:${
    args.query +
    (args.randomlyAppendTerms ? " " + pickRandom(args.randomlyAppendTerms) : "")
  }" --dump-json`;
  const rawOutput = execSync(searchCommand, {
    maxBuffer: 10 * 1024 * 1024, // 10 MB
  })
    .toString()
    .trim()
    .split("\n");
  const results = rawOutput.map((line) =>
    searchResultSchema.parse(JSON.parse(line))
  );
  return results || [];
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
    console.log(results.map(formatSearchResult).join("\n---\n"));
  })();
}
