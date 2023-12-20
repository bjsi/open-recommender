import { getInputFromCLI, searchList } from "prompt-iteration-assistant";
import { loadExampleTweetHistory } from "../../twitter/getUserContext";
import { search } from "../../youtube/search";
import { fetchTranscript } from "../../youtube/transcript";
import { recommendClips } from "../prompts/recommendClips/recommendClips";
import { rerankClips } from "../prompts/rerankClips/rerankClips";
import _ from "remeda";

export async function getUser() {
  const user = await getInputFromCLI("Twitter @username");
  return user;
}

export async function getQuery() {
  const query = await getInputFromCLI("YouTube search query");
  return query;
}

export async function searchAndChunk() {
  const user = await getUser();
  // get tweets from user
  // TODO: use real tweets
  const tweets = loadExampleTweetHistory(user).slice(0, 20);
  if (!tweets || tweets.length === 0) {
    console.error("Failed to fetch tweets for", user);
    process.exit(1);
  }
  const query = await getQuery();
  console.log("Searching for videos...");
  const results = await search({ query });
  if (!results) {
    console.error("Failed to search for videos");
    process.exit(1);
  }
  const videoTitle = await searchList({
    message: "Pick a video:",
    choices: results.map((r) => r.title),
  });
  const chosenVideo = results.find((r) => r.title === videoTitle);
  if (!chosenVideo) {
    console.error("Invalid video");
    process.exit(1);
  }
  const transcript = await fetchTranscript(chosenVideo.id, chosenVideo.title);
  if (!transcript) {
    console.error("Failed to fetch transcript");
    process.exit(1);
  }
  const clips = await recommendClips().execute({
    tweets,
    user,
    url: `https://www.youtube.com/watch?v=${chosenVideo.id}`,
    title: chosenVideo.title,
    transcript: transcript.cues,
  });
  console.log("Recommended clips:");
  console.log(clips);
  return {
    clips,
    tweets,
    results,
    query,
    user,
  };
}

export async function searchChunkAndRank() {
  const { clips, tweets, results, query, user } = await searchAndChunk();
  const shuffledClips = _.shuffle(clips);
  const rankedClips = await rerankClips().execute({
    tweets,
    user,
    clips: shuffledClips.map((clip, i) => ({
      id: i,
      title: clip.title,
      summary: clip.reason,
      text: clip.text,
    })),
  });
}
