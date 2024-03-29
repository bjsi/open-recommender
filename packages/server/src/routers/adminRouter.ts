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
import {
  getGraphileJobs,
  getPipelineJobByKey,
  getPipelineTaskJobById,
  getRunningWorkerIds,
} from "../lib/jobsPrisma";
import { indexBy, omit } from "remeda";

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
    const jobs = indexBy(await getGraphileJobs(), (x) => x.key || x.id);
    const pipelines = (
      await prisma.pipelineRun.findMany({
        include: {
          tasks: {
            include: {
              logs: true,
            },
          },
        },
      })
    ).map((p) => ({
      ...p,
      tasks: p.tasks.map((t) => ({
        ...t,
        // bigint
        job: jobs[t.jobId] ? omit(jobs[t.jobId], ["id"]) : null,
      })),
      job: jobs[p.jobKeyId] ? omit(jobs[p.jobKeyId], ["id"]) : null,
    }));
    return pipelines;
  }),
  retryPipelineTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const utils = await workerUtils();
      const task = await prisma.pipelineTask.findUnique({
        where: {
          jobId: input.id,
        },
      });
      if (!task) {
        throw new Error("pipeline not found");
      }
      const job = await getPipelineTaskJobById(task.jobId);
      if (!job) {
        throw new Error("job not found");
      }
      const xs = await utils.rescheduleJobs([job.id.toString()], {
        runAt: new Date(),
        attempts: 0,
      });
      if (xs.length === 0) {
        console.log("no jobs rescheduled");
      } else {
        console.log("rescheduled job");
      }
    }),
  cancelPipelineTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const task = await prisma.pipelineTask.findUnique({
        where: {
          jobId: input.id,
        },
      });
      if (!task) {
        throw new Error("pipeline not found");
      }
      const job = await getPipelineTaskJobById(task.jobId);
      if (!job) {
        throw new Error("job not found");
      }
      const utils = await workerUtils();
      const x = await utils.permanentlyFailJobs([job.id.toString()]);
      console.log("successfully failed", x.length, "jobs");
    }),
  deletePipeline: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const pipeline = await prisma.pipelineRun.findUnique({
        where: {
          id: input.id,
        },
        include: {
          tasks: true,
        },
      });
      if (!pipeline) {
        throw new Error("pipeline not found");
      }
      const utils = await workerUtils();
      const pipelineJob = await getPipelineJobByKey(pipeline.jobKeyId);
      if (pipelineJob) {
        const failed = await utils.permanentlyFailJobs([
          pipelineJob.id.toString(),
          ...pipeline.tasks.map((t) => t.jobId.toString()),
        ]);
        console.log("successfully failed", failed.length, "jobs");
      }
      await prisma.pipelineRun.delete({
        where: {
          id: input.id,
        },
      });
      await prisma.pipelineTask.deleteMany({
        where: {
          pipelineRunId: input.id,
        },
      });
    }),

  unlockWorkers: publicProcedure.mutation(async () => {
    const utils = await workerUtils();
    const workerIds = await getRunningWorkerIds();
    await utils.forceUnlockWorkers(workerIds);
    console.log("attempted to unlock workers", workerIds);
  }),
});
