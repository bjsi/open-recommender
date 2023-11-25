import { execSync } from "child_process";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { writeFileSync } from "fs";
import { z } from "zod";

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
  categories: z.array(z.string()),
  tags: z.any(),
  comment_count: z.number().nullable(),
  chapters: z
    .array(
      z.object({
        start_time: z.number(),
        title: z.string(),
        end_time: z.number(),
      })
    )
    .nullable(),
  like_count: z.number().nullable(),
  channel: z.string(),
  channel_follower_count: z.number(),
  upload_date: z.string(),
  playlist: z.string(),
  playlist_id: z.string(),
  display_id: z.string(),
  fulltitle: z.string(),
  language: z.string(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

export const formatSearchResult = (result: SearchResult) => {
  return `
Title: ${result.title}
Channel: ${result.channel}
Views: ${result.view_count}
Duration: ${dayjs().startOf("day").second(result.duration).format("H:mm:ss")}
Likes: ${result.like_count}
Chapters:
${result.chapters?.map((c, idx) => idx + 1 + ". " + c.title).join("\n")}
`.trim();
  // Rating: ${result.average_rating} // always seems to be null
};

export async function search(
  query: string,
  n_results: number = 3
): Promise<SearchResult[]> {
  const searchCommand = `yt-dlp "ytsearch${n_results}:${query}" --dump-json`;
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
  const query = process.argv[2];
  if (!query) {
    console.error("Please provide a query");
    process.exit(1);
  }
  search(query, 3).then((results) => {
    console.log(results.map(formatSearchResult).join("\n\n"));
  });
}
