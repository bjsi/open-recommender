import chalk from "chalk";
import { exec, execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { dataFolder } from "../filesystem";
import { parseSync, stringifySync } from "subtitle";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface Transcript {
  cues: TranscriptCue[];
  text: string;
  videoTitle: string;
  videoId: string;
}

const tryReadFileSync = (file: string) => {
  try {
    return readFileSync(file, "utf-8");
  } catch (error) {
    return undefined;
  }
};

export async function downloadTranscript(
  videoId: string
): Promise<string | undefined> {
  try {
    const fallbackAutoSubsCmd = [
      "yt-dlp",
      "--write-auto-sub",
      "--skip-download",
      "-o",
      `"${dataFolder}/${videoId}.%(ext)s"`,
      `https://www.youtube.com/watch?v=${videoId}`,
    ].join(" ");

    if (!existsSync(dataFolder)) {
      execSync(`mkdir -p ${dataFolder}`);
    }
    const filepath = path.join(dataFolder, `${videoId}.en.vtt`);
    if (!existsSync(filepath)) {
      await execAsync(fallbackAutoSubsCmd);
      if (existsSync(filepath)) {
        return filepath;
      } else {
        return undefined;
      }
    }
    return filepath;
  } catch (e) {
    return undefined;
  }
}

export async function fetchTranscript(
  videoId: string,
  videoTitle: string
): Promise<Transcript | undefined> {
  try {
    // if (!transcriptFile || !existsSync(transcriptFile)) {
    //   execSync(bestQualityTranscriptCmd);
    // }
    // const files2 = readdirSync(dataFolder);
    // transcriptFile = files2.find((x) => x.startsWith(videoId));
    const filepath = await downloadTranscript(videoId);
    let transcriptText = filepath ? tryReadFileSync(filepath) : undefined;
    if (!transcriptText) {
      console.error(
        chalk.red(
          `Failed to download transcript for video ID ${videoId}: ${transcriptText}`
        )
      );
      return;
    }
    const cues = await parseTranscript({
      transcript: transcriptText,
      videoId,
      videoTitle,
    });
    return {
      videoId,
      videoTitle,
      cues,
      text: transcriptText,
    };
  } catch (error) {
    console.error(
      chalk.red(
        `Failed to download transcript for video ID ${videoId}: ${error}`
      )
    );
  }
}

export function transcriptToMarkdownCues(
  cues: TranscriptCue[],
  delimiter = "\n---\n"
) {
  return cues
    .map((cue, id) =>
      `
ID: ${id}
${cue.text}
`.trim()
    )
    .join(delimiter);
}

export function transcriptToString(cues: TranscriptCue[]) {
  return cues.map((cue) => cue.text).join(" ");
}

export interface TranscriptCue {
  videoTitle: string;
  /**
   * URL of the source video.
   * Includes timestamp, eg. https://www.youtube.com/watch?v=videoId&t=1s
   */
  url: string;
  text: string;
  /**
   * The start of the chunk, in seconds.
   */
  start: number;
  /**
   * The end of the chunk, in seconds.
   */
  end: number;
}

async function parseTranscript(args: {
  transcript: string;
  videoId: string;
  videoTitle: string;
}): Promise<TranscriptCue[]> {
  const { transcript, videoId, videoTitle } = args;
  const parsedTranscript = parseSync(transcript);
  const chunks = parsedTranscript
    .filter((x) => x.type === "cue")
    .map((cue) => {
      const start =
        typeof cue.data === "string"
          ? 0
          : cue.data.start <= 10_000
          ? 0
          : Math.floor(cue.data.start / 1000);
      const end =
        typeof cue.data === "string" ? 0 : Math.ceil(cue.data.end / 1000);
      return {
        videoTitle,
        text: (typeof cue.data === "string" ? cue.data : cue.data.text)
          .trim()
          .replace(/\n/g, " ")
          .replace(/\&nbsp;/g, " ")
          // remove all tags
          .replace(/\[.*?\]/g, ""),
        type: "youtube",
        url: `https://www.youtube.com/watch?v=${videoId}&t=${start}s`,
        start,
        end,
      };
    })
    .filter((x) => !x.text.includes("<c>")) as TranscriptCue[];
  return chunks;
}

export const transcriptCuesToVtt = (cues: TranscriptCue[]) => {
  return stringifySync(
    cues.map((cue) => ({
      data: { text: cue.text, start: cue.start * 1000, end: cue.end * 1000 },
      type: "cue",
    })),
    { format: "WebVTT" }
  );
};

if (require.main === module) {
  const videoId = process.argv[2] || "eAnNGqwI2AQ";
  if (!videoId) {
    console.error("Please provide a video ID");
    process.exit(1);
  }
  console.log("Fetching", videoId);
  fetchTranscript(
    videoId,
    "The 10 AI Innovations Expected to Revolutionize 2024 - 2025"
  ).then((result) => {
    console.log(result?.cues || []);
    writeFileSync("transcript.json", JSON.stringify(result, null, 2));
  });
}
