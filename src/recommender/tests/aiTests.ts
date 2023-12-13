const promptTests: Record<string, EvaluateTestSuite> = {
  "filter-search-results": {
    ...functionCallOptions({
      model: filterSearchResults.model,
      prompts: [filterSearchResults.prompt],
      functions: [filterSearchResults.function!.function],
    }),
    tests: [
      {
        vars: {
          results: searchResultsToString(
            interleaveArrays(
              remnoteFlashcardsSearchResults,
              elonMuskSearchResults
            )
          ),
          queries: ["learning software."],
        } satisfies FilterSearchResultsInputVars,
        assert: [assertValidSchema(filterSearchResults.function!.schema)],
      },
    ],
  },
  "create-queries": {
    ...functionCallOptions({
      model: createYouTubeSearchQueries("experilearning").model,
      prompts: createYouTubeSearchQueriesPrompts,
      functions: [
        createYouTubeSearchQueries("experilearning").function!.function,
      ],
    }),
    tests: [
      // {
      //   vars: {
      //     tweets: tweetsToString(
      //       loadExampleTweetHistory("experilearning") || [],
      //       "experilearning"
      //     ),
      //   } satisfies CreateQueriesInputVars,
      //   assert: [],
      // },
      {
        vars: {
          tweets: tweetsToString({
            tweets: loadExampleTweetHistory("corbtt") || [],
            user: "corbtt",
          }),
        } satisfies CreateQueriesInputVars,
        assert: [],
      },
    ],
  },
  // "infer-interests": {
  //   ...plainTextTestOptions({
  //     model: createYouTubeSearchQueries.model,
  //     prompt: createYouTubeSearchQueries.prompt,
  //   }),
  //   tests: [
  //     {
  //       vars: {
  //         userContext:
  //           "The user is interested in software to assist with learning like Anki.",
  //       } satisfies CreateQueriesInputVars,
  //       assert: [],
  //     },
  //   ],
  // },
};
