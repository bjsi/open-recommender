import { recommender } from "./recommender";
import { parseCreateQueriesOutput } from "./recommender/createQueries";
import { searchResultsToString } from "./recommender/filterSearchResults";
import { yt } from "./youtube";
import { SearchResult } from "./youtube/search";
import {
  TranscriptCue,
  transcriptToString as cuesToString,
} from "./youtube/transcript";
import chalk from "chalk";

(async () => {
  const userContext =
    process.argv[2] ||
    "The user is interested in software to assist learning, like RemNote and Anki.";
  console.log(chalk.blue("User context: " + userContext));

  const searchQueries = parseCreateQueriesOutput(
    (await recommender.search.createQueries({
      userContext,
    })) || ""
  );
  if (!searchQueries.length) {
    console.log(chalk.red("No search queries generated"));
    return;
  } else {
    console.log(chalk.green("Search queries:"));
    console.log(
      searchQueries.map((query, idx) => `${idx + 1}. ${query}`).join("\n")
    );
  }

  console.log(chalk.blue("Searching YouTube..."));
  const searchResults = (
    await Promise.all(searchQueries.map((query) => yt.search(query)))
  ).flat();
  if (!searchResults.length) {
    console.log(chalk.red("No results found"));
    return;
  } else {
    console.log(chalk.green(searchResults.length + " search results:"));
    console.log(
      searchResults
        .map((result, idx) => `${idx + 1}. ${result.title}`)
        .join("\n")
    );
  }

  const { recommendedVideos } = await recommender.search.filter({
    searchResults: searchResultsToString(searchResults),
    userContext,
  });
  if (!recommendedVideos.length) {
    console.log("No search results passed the search filter");
    return;
  }

  const filteredResults = recommendedVideos.map((id) => searchResults[id]);
  console.log(chalk.green("Search results that passed the search filter:"));
  console.log(
    filteredResults
      .map((result, idx) => `${idx + 1}. ${result.title}`)
      .join("\n")
  );

  return;

  type SearchResultWithTranscript = SearchResult & {
    cues: TranscriptCue[];
  };
  const appraised: SearchResultWithTranscript[] = [];
  for (const result of filteredResults) {
    console.log(result.title);
    const fetchResult = await yt.transcript.fetch(result.id, result.title);
    if (!fetchResult || !fetchResult.cues.length) {
      console.log("Skipping video without transcript");
      continue;
    }
    const { cues } = fetchResult;
    const appraisal = await recommender.transcript.appraise({
      transcript: cuesToString(cues),
      videoTitle: result.title,
      userContext,
    });
    if (appraisal.recommend) {
      console.log("Recommending " + result.title);
      console.log(appraisal.reasoning);
      appraised.push({ ...result, cues });
    }
  }

  if (!appraised.length) {
    console.log("No results passed the transcript appraisal filter");
    return;
  }

  // const chunkedTranscripts = [];
  // for (const result of appraised) {
  //   const chunked = await recommender.transcript.chunk({ results: [result] });
  //   chunkedTranscripts.push(...chunked);
  // }

  // const chunked = await recommender.transcript.chunk({ results: appraised });
})();
