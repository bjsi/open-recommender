import { execSync } from "child_process";
import dotenv from "dotenv";

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
Duration: ${result.duration}
Description: ${result.description}
`.trim();
};

export async function search(
  query: string,
  n_results: number = 5
): Promise<SearchResult[]> {
  const searchCommand = `yt-dlp "ytsearch${n_results}:${query}" --dump-json`;
  const results = JSON.parse(execSync(searchCommand).toString().trim());
  return results;
}
