import { Logger, TaskList, parseCronItem, run } from "graphile-worker";
import dotenv from "dotenv";
import { workerUtils } from "./workerUtils";
import { prisma } from "../db";
import { TaskStatus } from "@prisma/client";
import { twitterPipeline } from "./twitterPipeline.saga";
import { KeysWithoutBar, TaskNamePayloadMaps } from "./saga";
import { defaultLogger } from "graphile-worker/dist/logger";
import { getNumRunningPipelines } from "../lib/getNumRunningPipelines";
import { MAX_RUNNING_PIPELINES_PER_USER } from "./consts";
import { v4 as uuidv4 } from "uuid";
import { shuffle } from "remeda";

dotenv.config();

// iterate over all users
// for each user, check if they have < max pipelines
// if they have < max pipelines, add a pipeline to get recommendations
export const addPipelineCronJob = {
  id: "recurring-add-pipeline-cron",
  handler: async () => {
    const users = shuffle(await prisma.user.findMany());
    for (const user of users) {
      const numActivePipelines = await getNumRunningPipelines(user);
      if (
        !numActivePipelines ||
        numActivePipelines < MAX_RUNNING_PIPELINES_PER_USER
      ) {
        await addPipeline("twitter-pipeline-v1", {
          username: user.username,
          runId: uuidv4(),
          emailResults: true,
        });
      }
    }
  },
};

const taskList = {
  ...twitterPipeline.getTaskList(),
  [addPipelineCronJob.id]: addPipelineCronJob,
} as const;

export async function addPipeline<Name extends KeysWithoutBar<typeof taskList>>(
  taskName: Name,
  payload: TaskNamePayloadMaps<typeof taskList>[Name] & {
    username: string;
    runId: string;
    runAt?: Date;
  }
) {
  console.log("Adding pipeline", taskName, payload);
  const utils = await workerUtils();
  await prisma.pipelineRun.create({
    data: {
      jobKeyId: payload.runId,
      username: payload.username,
    },
  });
  const job = await utils.addJob(taskName, payload as any, {
    jobKey: payload.runId,
    runAt: payload.runAt,
  });
  return job;
}

const consoleLogger = defaultLogger;

export async function startWorker() {
  const runner = await run({
    parsedCronItems: [
      parseCronItem({
        task: addPipelineCronJob.id,
        // every 24 hrs
        match: "0 0 * * *",
      }),
    ],
    concurrency: 2,
    noHandleSignals: false,
    pollInterval: 2000,
    logger: new Logger(() => async (level, message, meta) => {
      consoleLogger[level === "warning" ? "warn" : level](message, meta);
      const data = meta as { jobId?: string } | undefined;
      if (!data?.jobId) {
        return;
      }
      const task = await prisma.pipelineTask.findFirst({
        where: { jobId: data.jobId },
      });
      if (task) {
        await prisma.pipelineTaskLog.create({
          data: {
            pipelineTaskId: task.id,
            log: message,
            level,
          },
        });
      }
    }),
    taskList: taskList as TaskList,
    connectionString: process.env.DATABASE_URL,
  });
  const getTaskOrPipeline = async (jobOrKeyId: string) => {
    const pipeline = await prisma.pipelineRun.findFirst({
      where: { jobKeyId: jobOrKeyId },
    });

    if (pipeline) {
      return "pipeline";
    }
    const task = await prisma.pipelineTask.findFirst({
      where: { jobId: jobOrKeyId },
    });
    if (task) {
      return "task";
    }
    return null;
  };

  const setTaskOrPipelineStatus = async (
    jobIdOrKey: string,
    status: TaskStatus
  ) => {
    const type = await getTaskOrPipeline(jobIdOrKey);
    if (type === "pipeline") {
      await prisma.pipelineRun.update({
        where: { jobKeyId: jobIdOrKey },
        data: {
          status,
        },
      });
    } else if (type === "task") {
      await prisma.pipelineTask.update({
        where: { jobId: jobIdOrKey },
        data: {
          status,
        },
      });
    }
  };

  runner.events.on("job:error", (err) => {
    console.log("Job success", err);
    setTaskOrPipelineStatus(err.job.key || err.job.id, "retrying");
  });

  runner.events.on("job:success", ({ job }) => {
    console.log("Job success", job.key || job.id);
    setTaskOrPipelineStatus(job.key || job.id, "completed");
  });

  runner.events.on("job:complete", ({ job, error }) => {
    console.log("Job complete", job.key || job.id, error);
    if (error) {
      setTaskOrPipelineStatus(job.key || job.id, "failed");
    } else {
      setTaskOrPipelineStatus(job.key || job.id, "completed");
    }
  });
}

if (require.main === module) {
  (async () => {
    await startWorker();
  })();
}
