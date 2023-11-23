import { recommender } from "./recommender";
import { yt } from "./youtube";
import { SearchResult } from "./youtube/search";
import { TranscriptChunk } from "./youtube/transcript";

(async () => {
  const results = await yt.search("space");
  if (!results.length) {
    console.log("No results found");
    return;
  }

  const filtered = await recommender.filter({ results });
  if (!filtered.length) {
    console.log("No results passed the search filter");
    return;
  }

  const appraised: (SearchResult & { transcript: TranscriptChunk[] })[] = [];
  for (const result of filtered) {
    console.log(result.title);
    const transcript = await yt.transcript.fetch(result.id, result.title);
    if (!transcript || !transcript.length) {
      console.log("Skipping video without transcript");
      continue;
    }
    const appraisal = await recommender.transcript.appraise({ transcript });
    if (appraisal.success) {
      appraised.push({ ...result, transcript });
    }
  }

  if (!appraised.length) {
    console.log("No results passed the transcript appraisal filter");
    return;
  }
})();
