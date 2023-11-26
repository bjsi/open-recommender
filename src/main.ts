import { recommender } from "./recommender";
import { splitTranscript } from "./recommender/chunkTranscript";
import { parseCreateQueriesOutput } from "./recommender/createQueries";
import { searchResultsToString } from "./recommender/filterSearchResults";
import { yt } from "./youtube";
import { SearchResult } from "./youtube/search";
import {
  TranscriptCue,
  transcriptToString as cuesToString,
  transcriptCuesToVtt,
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

  type SearchResultWithTranscript = SearchResult & {
    cues: TranscriptCue[];
  };
  console.log(chalk.blue(`Fetching ${filteredResults.length} transcripts...`));
  const resultsWithTranscripts = (
    await Promise.all(
      filteredResults.map(async (result) => {
        const fetchResult = await yt.transcript.fetch(result.id, result.title);
        if (!fetchResult || !fetchResult.cues.length) {
          console.log("Skipping video without transcript");
          return;
        } else {
          return { ...result, cues: fetchResult.cues };
        }
      })
    )
  ).filter(Boolean) as SearchResultWithTranscript[];
  console.log(
    chalk.green(
      resultsWithTranscripts.length + " transcripts fetched successfully"
    )
  );

  if (!resultsWithTranscripts.length) {
    console.log("No results passed the transcript appraisal filter");
    return;
  }

  for (const result of resultsWithTranscripts.slice(0, 1)) {
    const webvttText = transcriptCuesToVtt(result.cues);
    const parts = await splitTranscript(webvttText);
    console.log(chalk.blue(`Generating chapters for "${result.title}"...`));
    const chapters = (
      await Promise.all(
        parts.map(async (part) => {
          const chunked = await recommender.transcript.chunk({
            transcript: part,
            videoTitle: result.title,
          });
          return chunked.sections;
        })
      )
    ).flat();
    console.log(chalk.green(chapters.length + " chapters generated"));
    console.log(JSON.stringify(chapters, null, 2));
  }
})();
