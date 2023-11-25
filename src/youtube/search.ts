import { execSync } from "child_process";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

export interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  channel_id: string;
  channel_url: string;
  duration: number;
  view_count: number;
  average_rating: any;
  categories: string[];
  tags: any[];
  comment_count: number;
  chapters: any;
  like_count: number;
  channel: string;
  channel_follower_count: number;
  upload_date: string;
  playlist: string;
  playlist_id: string;
  display_id: string;
  fulltitle: string;
  language: string;
}

export const formatSearchResult = (result: SearchResult) => {
  return `
Title: ${result.title}
Channel: ${result.channel}
Views: ${result.view_count}
Duration: ${dayjs().startOf("day").second(result.duration).format("H:mm:ss")}
Rating: ${result.average_rating}
`.trim();
};

export async function search(
  query: string,
  n_results: number = 5
): Promise<SearchResult[]> {
  const searchCommand = `yt-dlp "ytsearch${n_results}:${query}" --dump-json`;
  const rawOutput = execSync(searchCommand, {
    maxBuffer: 10 * 1024 * 1024, // 10 MB
  })
    .toString()
    .trim()
    .split("\n");
  const results = rawOutput.map((line) => JSON.parse(line));
  return results;
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
