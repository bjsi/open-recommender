import { z } from "zod";
import { Saga } from "./saga";
import { prisma } from "../db";
import { getSavedTweetsForUser } from "../lib/tweets";
import { twitter } from "cli/src/twitter";
import { yt } from "cli/src/youtube";
import { withPerformanceMeasure } from "./perf";
import { getTwitterAPISingleton } from "../lib/twitter";
import { getUserProfile } from "cli/src/twitter/getUserContext";
import { recursivelySummarizeTweets } from "cli/src/recommender/prompts/recursiveTwitterSummarizer/recursiveTwitterSummarizer";
import { createQueriesFromProfile } from "cli/src/recommender/prompts/createQueriesFromProfile/createQueriesFromProfile";
import { createRequestTags } from "cli/src/openpipe/requestTags";
import { brainstormQuestions } from "cli/src/recommender/prompts/brainstormSubQuestions/brainstormQuestions";
import { pAll } from "cli/src/pipeline/utils/pAll";
import { Resend } from "resend";

export const twitterPipeline = new Saga(
  "twitter-pipeline-v1",
  z.object({
    runId: z.string(),
    username: z.string(),
    summary: z.string().optional(),
    queries: z.string().array().optional(),
    skipUserCheck: z.boolean().optional(),
    enableOpenPipeLogging: z.boolean().optional(),
  })
)
  .addStep({
    name: "get-user",
    run: async (initialPayload, priorResults, helpers) => {
      const { username } = initialPayload;
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user && !initialPayload.skipUserCheck) {
        throw new Error("User not found");
      }
      helpers.logger.info(`Creating recommendations for Twitter user @${user}`);
      return { user };
    },
  })
  .addStep({
    name: "get-tweets",
    run: async (initialPayload, priorResults, helpers) => {
      const { user } = priorResults["get-user"];
      if (initialPayload.summary) {
        helpers.logger.info("Using existing summary, skipping get-tweets step");
        helpers.logger.debug(initialPayload.summary);
        return { tweets: [] };
      } else if (initialPayload.queries) {
        helpers.logger.info("Using custom queries, skipping get-tweets step");
        helpers.logger.debug(JSON.stringify(initialPayload.queries, null, 2));
        return { tweets: [] };
      }

      const lastSavedTweet = user
        ? (
            await getSavedTweetsForUser({
              username: user.username,
              limit: 1,
            })
          )[0]
        : undefined;

      const tweets = (
        await withPerformanceMeasure(
          "fetch-tweets",
          () =>
            twitter.tweets.fetch({
              user: initialPayload.username,
              n_tweets: 200,
              since_id: lastSavedTweet?.tweetId,
            }),
          helpers.logger
        )
      ).slice(0, 300);

      if (tweets.length < 300 && lastSavedTweet) {
        const moreTweets = await getSavedTweetsForUser({
          username: initialPayload.username,
          before: lastSavedTweet.tweetedAt.toISOString(),
          limit: 300 - tweets.length,
        });
        tweets.push(...moreTweets.map((x) => x.data));
      }

      if (!tweets.length) {
        helpers.logger.info("No tweets fetched");
      } else {
        helpers.logger.info(`${tweets.length} tweets fetched successfully`);
      }
      return { tweets };
    },
  })
  .addStep({
    name: "summarize-tweets",
    run: async (initialPayload, priorResults, helpers) => {
      const { username } = initialPayload;
      helpers.logger.info(`Summarizing tweets for Twitter user @${username}`);
      const api = getTwitterAPISingleton();
      const twitterUser = await getUserProfile(api, username);
      if (initialPayload.summary) {
        helpers.logger.info("Using existing summary, skipping summary");
        helpers.logger.debug(initialPayload.summary);
        return {
          profile: initialPayload.summary,
          twitterUser,
        };
      }

      const profile = await recursivelySummarizeTweets().execute({
        user: twitterUser,
        tweets: priorResults["get-tweets"].tweets,
        enableOpenPipeLogging: initialPayload.enableOpenPipeLogging,
      });

      if (!profile) {
        helpers.logger.info("Failed to summarize tweets");
        throw new Error("Failed to summarize tweets");
      } else {
        helpers.logger.info("Tweets summarized successfully");
        helpers.logger.debug(profile);
        return {
          profile,
        };
      }
    },
  })
  .addStep({
    name: "create-queries-metaphor",
    run: async (initialPayload, priorResults, helpers) => {
      helpers.logger.info("Creating Metaphor search queries...");
      const queries: string[] = [];
      if (initialPayload.queries) {
        queries.push(...initialPayload.queries);
      } else {
        const res = await createQueriesFromProfile().execute({
          enableOpenPipeLogging: initialPayload.enableOpenPipeLogging,
          openPipeRequestTags: createRequestTags({
            runId: initialPayload.runId,
            user: initialPayload.username,
          }),
          profile: priorResults["summarize-tweets"].profile,
          bio:
            priorResults["summarize-tweets"].twitterUser?.rawDescription || "",
          user: initialPayload.username,
        });
        queries.push(...res.queries);
      }
      const queriesWithQuestions = await pAll(
        queries.map((query) => async () => {
          const questions = await brainstormQuestions().execute({
            query,
            enableOpenPipeLogging: initialPayload.enableOpenPipeLogging,
            openPipeRequestTags: createRequestTags({
              runId: initialPayload.runId,
              user: initialPayload.username,
            }),
          });
          return {
            query,
            questions,
          };
        }),
        { concurrency: 5 }
      );
      if (!queriesWithQuestions.length) {
        const msg = "No search queries generated";
        throw new Error(msg);
      } else {
        helpers.logger.info(`${queriesWithQuestions.length} queries generated`);
        helpers.logger.debug(JSON.stringify(queriesWithQuestions, null, 2));
        helpers.logger.info("Limiting to 5 queries");
        return {
          queriesWithQuestions: queriesWithQuestions.slice(0, 5),
        };
      }
    },
  })
  .addStep({
    name: "search-for-videos",
    run: async (initialPayload, priorResults, helpers) => {
      const { queriesWithQuestions } = priorResults["create-queries-metaphor"];

      helpers.logger.info("Searching YouTube...");

      const youtubeResults = await pAll(
        queriesWithQuestions.map(({ query, questions }) => async () => {
          const results = await yt.search({
            query: query,
            n_results: 20,
          });
          return {
            query,
            questions: [query, ...questions],
            searchResults: results,
          };
        }),
        { concurrency: 2 }
      );

      const metaphorYouTubeResults = await pAll(
        queriesWithQuestions.map(({ query, questions }) => async () => {
          const rawSearchResultsForQuery = await searchYouTube({
            query,
            numResults: 20,
          });
          console.log(
            chalk.blue(
              rawSearchResultsForQuery
                .map((result, idx) => `${idx + 1}. ${result.title}`)
                .join("\n")
            )
          );
          return {
            query,
            questions: [query, ...questions],
            searchResults: rawSearchResultsForQuery,
          };
        }),
        { concurrency: 10 }
      );

      const metaphorArticleResults = await pAll(
        queriesWithQuestions.map(({ query, questions }) => async () => {
          const results = await searchNonYouTube({
            query,
            numResults: 20,
          });
          return {
            query,
            questions: [query, ...questions],
            searchResults: results,
          };
        }),
        { concurrency: 2 }
      );
      console.log(
        "all results",
        JSON.stringify({
          metaphorArticleResults,
          metaphorYouTubeResults,
          youtubeResults,
        })
      );

      const all = [
        ...youtubeResults,
        ...metaphorYouTubeResults,
        ...metaphorArticleResults,
      ];
      console.log(chalk.blue("Found " + all.length + " search results"));
      return success({ ...args, queryWithResults: all });
    },
  })
  .addStep({
    name: "email-results",
    run: async (initialPayload, priorResults, helpers) => {
      const resend = new Resend(process.env.RESEND_API_KEY);

      resend.emails.send({
        from: "onboarding@resend.dev",
        to: "jamesbaghurst@gmail.com",
        subject: "Hello World",
        html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
      });
    },
  });
