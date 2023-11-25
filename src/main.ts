import { recommender } from "./recommender";
import { parseCreateQueriesOutput } from "./recommender/createQueries";
import { searchResultsToString } from "./recommender/filterSearchResults";
import { yt } from "./youtube";
import { SearchResult } from "./youtube/search";
import {
  TranscriptCue,
  transcriptToString as cuesToString,
} from "./youtube/transcript";

(async () => {
  const userContext =
    "The user is interested in software to assist learning, like RemNote and Anki.";
  const searchQueries = parseCreateQueriesOutput(
    (await recommender.search.createQueries({
      userContext,
    })) || ""
  );

  const searchResults: SearchResult[] = [];
  for (const query of searchQueries) {
    const results = await yt.search(query);
    results.push(...results);
  }

  if (!searchResults.length) {
    console.log("No results found");
    return;
  }

  const { filteredSearchResultIds: filteredResults } =
    await recommender.search.filter({
      results: searchResultsToString(searchResults),
      userContext,
    });
  if (!filteredResults.length) {
    console.log("No results passed the search filter");
    return;
  }

  type SearchResultWithTranscript = SearchResult & {
    cues: TranscriptCue[];
  };
  const appraised: SearchResultWithTranscript[] = [];
  for (const idx of filteredResults) {
    const result = searchResults[idx];
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
