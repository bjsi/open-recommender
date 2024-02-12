import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import { TweetSchema } from "shared/src/manual/Tweet";
import {
  addRecommendationSchema,
  addRecommendations,
} from "../lib/addRecomendations";
import { getSavedTweetsForUser } from "../lib/tweets";
import { workerUtils } from "../tasks/workerUtils";
import { Prisma } from "@prisma/client";

export const adminRouter = router({
  addRecommendations: publicProcedure
    .input(addRecommendationSchema)
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      return await addRecommendations({ input, user });
    }),
  getTweets: publicProcedure
    .input(
      z.object({
        username: z.string(),
        before: z.string().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return getSavedTweetsForUser(input);
    }),
  saveTweets: publicProcedure
    .input(
      z.object({
        username: z.string(),
        tweets: TweetSchema.array(),
        summaryId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      await prisma.tweet.createMany({
        data: input.tweets.map((t) => ({
          tweetId: t.id,
          tweetedAt: t.date,
          userId: user.id,
          data: t as Record<string, any>,
          summaryId: input.summaryId,
        })),
      });
    }),
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          followers: true,
          following: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      return user;
    }),
  getPipelinesAndTasks: publicProcedure.query(async ({ ctx }) => {
    const pipelines = await prisma.pipelineRun.findMany({
      include: {
        tasks: true,
      },
    });
    return pipelines;
  }),
  retryPipeline: publicProcedure
    .input(
      z.object({
        pipelineId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const utils = await workerUtils();
      const pipeline = await prisma.pipelineRun.findUnique({
        where: {
          id: input.pipelineId,
        },
        include: {
          tasks: true,
        },
      });
      if (!pipeline) {
        throw new Error("pipeline not found");
      }
      const jobId = await prisma.$queryRaw(
        Prisma.sql`SELECT id FROM graphile_worker.jobs WHERE key = ${pipeline.jobKeyId}`
      );
      if (jobId == null) {
        throw new Error("job not found");
      }

      // utils.rescheduleJobs([jobId], {
      //   runAt: new Date(),
      // });
    }),
});
