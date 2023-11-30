import { writeFileSync } from "fs";
import { recommender } from "./recommender";
import { TranscriptChunk } from "./recommender/chunkTranscript";
import { twitter } from "./twitter";
import { yt } from "./youtube";
import { SearchResult } from "./youtube/search";
import { TranscriptCue } from "./youtube/transcript";
import chalk from "chalk";

(async () => {
  const user = process.argv[2] || "experilearning";
  console.log(chalk.blue(`Creating recommendations for Twitter user @${user}`));

  // get user context

  console.log(chalk.blue("Fetching tweets..."));
  const tweets = await twitter.tweets.fetch({
    user,
  });
  if (!tweets.length) {
    console.log(chalk.red("No tweets found"));
    return;
  } else {
    console.log(chalk.green(tweets.length + " tweets fetched successfully"));
  }

  // search for videos

  console.log(chalk.blue("Creating search queries..."));
  const { queries } = await recommender.queries.create({
    tweets,
    user,
  });
  if (!queries.length) {
    console.log(chalk.red("No search queries generated"));
    return;
  } else {
    console.log(chalk.green("Search queries:"));
    console.log(queries.map((query, idx) => `${idx + 1}. ${query}`).join("\n"));
  }

  console.log(chalk.blue("Searching YouTube..."));
  const results: SearchResult[] = [];
  for (const query of queries) {
    const queryResults = await yt.search({
      query,
      randomlyAppendTerms: ["podcast", "discussion"],
    });
    console.log(
      chalk.blue(
        queryResults
          .map((result, idx) => `${idx + 1}. ${result.title}`)
          .join("\n")
      )
    );
    results.push(...queryResults);
  }
  if (!results.length) {
    console.log(chalk.red("No results found"));
    return;
  } else {
    console.log(chalk.green(results.length + " total search results"));
  }

  // pre-filter search results

  // console.log(chalk.blue("Filtering search results..."));
  // const filteredResults = await recommender.search.filter({
  //   results,
  //   queries,
  // });
  // if (!filteredResults.length) {
  //   console.log("No search results passed the search filter");
  //   return;
  // }
  // console.log(
  //   chalk.green("Search results that passed the initial search filter:")
  // );
  // console.log(
  //   filteredResults
  //     .map((result, idx) => `${idx + 1}. ${result.title}`)
  //     .join("\n")
  // );

  type SearchResultWithTranscript = {
    searchResult: SearchResult;
    cues: TranscriptCue[];
  };

  // fetch transcripts

  console.log(chalk.blue(`Fetching ${results.length} transcripts...`));
  const resultsWithTranscripts: SearchResultWithTranscript[] = [];
  for (const result of results) {
    const { id, title } = result;
    const fetchResult = await yt.transcript.fetch({ id, title });
    if (!fetchResult || !fetchResult.cues.length) {
      console.log("Skipping video without transcript");
      continue;
    }
    resultsWithTranscripts.push({
      searchResult: result,
      cues: fetchResult.cues,
    });
  }
  console.log(
    chalk.green(
      resultsWithTranscripts.length + " transcripts fetched successfully"
    )
  );

  // appraise transcripts

  console.log(chalk.blue("Appraising transcripts..."));
  const appraisedResults: SearchResultWithTranscript[] = [];
  for (const result of resultsWithTranscripts) {
    const { recommend, reasoning } = await recommender.transcript.appraise({
      transcript: result.cues,
      title: result.searchResult.title,
    });
    if (!recommend) {
      console.log(
        chalk.blue(`Rejecting video ${result.searchResult.title}. ${reasoning}`)
      );
      continue;
    } else {
      console.log(
        chalk.green(
          `Accepting video ${result.searchResult.title}. ${reasoning}`
        )
      );
      appraisedResults.push({ ...result });
    }
  }

  // chunk transcripts
  type SearchResultWithTranscriptAndChunks = {
    searchResult: SearchResult;
    cues: TranscriptCue[];
    chunks: TranscriptChunk[];
  };

  const chunkedTranscripts: SearchResultWithTranscriptAndChunks[] = [];
  for (const result of resultsWithTranscripts) {
    console.log(
      chalk.blue(`Generating chapters for "${result.searchResult.title}"...`)
    );
    const chunks = await recommender.transcript.chunk({
      transcript: result.cues,
      title: result.searchResult.title,
    });
    if (!chunks.length) {
      console.log(
        chalk.red("No chapters generated for " + result.searchResult.title)
      );
      continue;
    } else {
      console.log(
        chalk.green(
          `${chunks.length} chapters generated for "${result.searchResult.title}"`
        )
      );
      console.log(chunks);
      chunkedTranscripts.push({
        ...result,
        chunks,
      });
    }
  }

  writeFileSync(
    "chunkedTranscripts.json",
    JSON.stringify(chunkedTranscripts, null, 2),
    "utf-8"
  );
})();
