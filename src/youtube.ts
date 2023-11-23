import chalk from "chalk";
import { execSync } from "child_process";
import cliProgress from "cli-progress";
import dotenv from "dotenv";
import path from "path";
import { dataFolder } from "./filesystem";
import { readFile, readFileSync } from "fs";
import { parseTranscript } from "./transcript";

dotenv.config();

interface SearchResult {
  title: string;
  id: string;
}

export async function search(
  query: string,
  n_results: number = 5
): Promise<SearchResult[]> {
  const searchCommand = `yt-dlp "ytsearch:${n_results}:${query}"`;
  const results = execSync(searchCommand).toString().trim();
  return results;
}

export async function getOrDownloadTranscript(
  videoId: string,
  videoTitle: string
) {
  const command = `yt-dlp --write-sub --write-auto-sub --sub-lang en --sub-format vtt --skip-download -o "${dataFolder}/${videoId}.%(ext)s" "https://www.youtube.com/watch?v=${videoId}"`;
  try {
    execSync(command);
    const transcriptText = readFileSync(
      path.join(dataFolder, `${videoId}.en.vtt`),
      "utf-8"
    );
    return await parseTranscript({
      transcript: transcriptText,
      videoId,
      videoTitle,
    });
  } catch (error) {
    console.error(
      chalk.red(
        `Failed to download transcript for video ID ${videoId}: ${error}`
      )
    );
  }
}
