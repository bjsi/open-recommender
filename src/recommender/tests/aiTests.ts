const promptTests: Record<string, EvaluateTestSuite> = {
  "create-queries": {
    ...functionCallOptions({
      model: createYouTubeSearchQueries("experilearning").model,
      prompts: createYouTubeSearchQueriesPrompts,
      functions: [
        createYouTubeSearchQueries("experilearning").function!.function,
      ],
    }),
    tests: [
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
};
