import chalk from "chalk";
import { execSync } from "child_process";
import cliProgress from "cli-progress";
import dotenv from "dotenv";

dotenv.config();

export async function downloadTranscripts() {
  const channelURL = "";
  const channelId = "";

  let processedIds: string[] = [];

  // Fetch all video IDs from the channel
  console.clear();
  console.log(chalk.blue(`Fetching all video IDs (can be slow)...`));
  const videoIdCommand = `yt-dlp --get-id -i "${channelURL}"`;
  const videoIdsRaw = execSync(videoIdCommand).toString().trim();
  const videoIds = videoIdsRaw.split("\n");

  // Filter out already processed IDs
  const newVideoIds = videoIds.filter((id) => !processedIds.includes(id));

  if (newVideoIds.length === 0) {
    console.log(chalk.green(`No new videos`));
    return;
  }

  console.log(chalk.green(`Found ${newVideoIds.length} new videos`));
  console.log(chalk.blue(`Downloading transcripts...`));

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(newVideoIds.length, 0);

  newVideoIds.forEach((id) => {
    progressBar.increment();
    // TODO: languages
    // TODO: output JSON
    const command = `yt-dlp --write-sub --write-auto-sub --sub-lang en --sub-format vtt --skip-download -o "${transcriptDir}/${id}.%(ext)s" "https://www.youtube.com/watch?v=${id}"`;
    try {
      execSync(command);
      processedIds.push(id);
    } catch (error) {
      console.error(
        chalk.red(`Failed to download transcript for video ID ${id}: ${error}`)
      );
    }
  });

  progressBar.stop();
  console.log(chalk.green(`Done!`));
}
