import { writeFileSync } from "fs";
import { recommender } from "./recommender";
import { TranscriptChunk } from "./recommender/chunkTranscript";
import { twitter } from "./twitter";
import { yt } from "./youtube";
import { SearchResult } from "./youtube/search";
import { TranscriptCue } from "./youtube/transcript";
import chalk from "chalk";
import { tweetsToString } from "./twitter/getUserContext";
import { Tweet } from "./twitter/schemas";

(async () => {
  const user = process.argv[2] || "experilearning";
  console.log(chalk.blue(`Creating recommendations for Twitter user @${user}`));

  // get user context

  console.log(chalk.blue("Fetching tweets..."));
  const tweets = await twitter.tweets.fetch({
    user,
    n_tweets: 30,
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
  }

  const queriesWithTweets = queries.map(({ query, tweetIDs }) => ({
    query,
    tweets: tweetIDs.map((id) => tweets[id]),
  }));
  console.log(chalk.green("Created " + queries.length + " search queries"));
  for (let i = 0; i < queriesWithTweets.length; i++) {
    const { query, tweets } = queriesWithTweets[i];
    console.log("-----------------");
    console.log(chalk.blue(i + ". " + query.join(" ")));
    console.log(tweetsToString({ tweets, user }));
  }

  type SearchResultsWithTweets = {
    searchResults: { result: SearchResult; relevance: number }[];
    query: string;
    tweets: Tweet[];
  };

  console.log(chalk.blue("Searching YouTube..."));
  const filteredResults: SearchResultsWithTweets[] = [];
  for (const { query, tweets } of queriesWithTweets) {
    console.log(chalk.blue("Searching for " + query.join(" ")));
    const rawYouTubeSearchResults = await yt.search({
      query: query.join(" "),
    });
    console.log(
      chalk.blue(
        rawYouTubeSearchResults
          .map((result, idx) => `${idx + 1}. ${result.title}`)
          .join("\n")
      )
    );
    // pre-filter search results
    console.log(
      chalk.blue("Found " + rawYouTubeSearchResults.length + " search results")
    );
    console.log(chalk.blue("Filtering search results..."));
    const filteredResultsForQuery = await recommender.search.filter({
      user,
      query: query.join(" "),
      results: rawYouTubeSearchResults,
      tweets,
    });

    console.log("Filtered search results:");

    console.log(
      filteredResultsForQuery
        .map(
          ({ result, relevance }, idx) =>
            `${idx + 1}. ${result.title} (${relevance})`
        )
        .join("\n")
    );

    const relevantResults = filteredResultsForQuery.filter(
      (result) => result.relevance > 0.65
    );

    console.log(
      chalk.green(
        relevantResults.length +
          " search results passed the relevance filter (> 0.65 relevance)"
      )
    );

    filteredResults.push({
      query: query.join(" "),
      tweets: tweets,
      searchResults: relevantResults,
    });
  }
  if (!filteredResults.length) {
    console.log("No search results passed the search filter");
    return;
  }
  console.log(
    chalk.green("Search results that passed the initial search filter:")
  );
  console.log(
    filteredResults
      .flatMap((r) => r.searchResults)
      .map(({ result }, idx) => `${idx + 1}. ${result.title}`)
      .join("\n")
  );

  type SearchResultWithTranscript = {
    searchResult: SearchResult;
    tweets: Tweet[];
    cues: TranscriptCue[];
    query: string;
    relevance: number;
  };

  // fetch transcripts

  console.log(
    chalk.blue(
      `Fetching ${
        filteredResults.flatMap((r) => r.searchResults).length
      } transcripts...`
    )
  );
  const resultsWithTranscripts: SearchResultWithTranscript[] = [];
  for (const results of filteredResults) {
    for (const result of results.searchResults) {
      const { id, title } = result.result;
      const fetchResult = await yt.transcript.fetch({ id, title });
      if (!fetchResult || !fetchResult.cues.length) {
        console.log("Skipping video without transcript");
        continue;
      }
      resultsWithTranscripts.push({
        searchResult: result.result,
        cues: fetchResult.cues,
        tweets: results.tweets,
        query: results.query,
        relevance: result.relevance,
      });
    }
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
      tweets: result.tweets,
      user,
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
})().catch(console.log);
