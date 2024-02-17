import { Logger, TaskList, run } from "graphile-worker";
import dotenv from "dotenv";
import { workerUtils } from "./workerUtils";
import { prisma } from "../db";
import { TaskStatus } from "@prisma/client";
import { twitterPipeline } from "./twitterPipeline.saga";
import { KeysWithoutBar, TaskNamePayloadMaps } from "./saga";
import { defaultLogger } from "graphile-worker/dist/logger";

dotenv.config();

const taskList = {
  ...twitterPipeline.getTaskList(),
} as const;

export const addPipeline = async <Name extends KeysWithoutBar<typeof taskList>>(
  taskName: Name,
  payload: TaskNamePayloadMaps<typeof taskList>[Name] & {
    username: string;
    runId: string;
  }
) => {
  const utils = await workerUtils();
  await prisma.pipelineRun.create({
    data: {
      jobKeyId: payload.runId,
      username: payload.username,
    },
  });
  const job = await utils.addJob(taskName, payload as any, {
    jobKey: payload.runId,
  });
  return job;
};

const consoleLogger = defaultLogger;

export async function startWorker() {
  const runner = await run({
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
    //   await new Promise((resolve) => setTimeout(resolve, 5000));
    //   const summary = `Jamesb, a user with a fascination for Large Language Models (LLMs) and Spaced Repetition Systems (SRS), has shown a deep interest in understanding and improving learning methods, particularly in merging the worlds of recommender systems and flashcard learning applications, as shown by their tweets and article 'From Spaced Repetition Systems to Open Recommender Systems'. Jamesb enjoys engaging discussions and shares on subjects such as open-source artificial intelligence (AI), LLMs, technology restrictions, and perception of average individuals, evident from their interactions with users like Zander and Lars_Grammel. They also have a liking for podcasts, specifically ones by Joe Walker and Dwarkesh Patel, proving an interest in intellectual conversations and exploring novel ideas. They are involved in the project titled 'Twitter for Free Learners', working with @norman.nashwin while aspiring to post more on Twitter and interact with the Internet learning community. Their support for RSS reader-style internet consumption indicates an enthusiasm for personalized content recommendation. Himself/herself is building an app under the name 'rem_note' in the multiverse. Jamesb, a technology enthusiast with a passion for artificial intelligence (AI), primarily focuses on the development and application of large language models (LLMs) and Spaced Repetition Systems (SRS). He applies these interests to build recommender systems, believing that such systems should focus on providing timeless and personalized content. These systems involve using metadata created by Generative Pretrained Transformer 2 (GPT-2) models and techniques such as pipeline abstractions or memoize functions for debugging. He is currently building an SRS application called RemNote and is intrigued by how OpenAI’s text-to-speech (TTS) technology could be integrated into his developments. Jamesb also explores the utilisation of LLMs in citation validation, specific methods of software development, and AI for music generation.  Active in the tech community and a supporter of the open-source approach, Jamesb interacts with technologists like Erik Bjäreholt and Kyle Corbitt, and engages in public discourse around companies like OpenAI. In conjunction with his technological interests, he also maintains an active interest in AI research and social network innovation, with a particular focus on French innovation in these fields. Jamesb is not only an ardent supporter of technological developments but also promotes the ideological shifts to make these technologies more efficient and user-centric. He supports the ideas of Dominic Cummings and David Deutsch, notably the restructuring of Western governments. He is also a key promoter of the quick iteration process, as he believes in the elimination of slow feedback loops to foster dynamic progress. Jamesb, an artificial intelligence (AI) enthusiast with particular interest in large language models (LLMs), is currently working on building a space repetition system application named Remnote. Recently, he has been actively tweeting about leveraging tools like the BakLLaVA-1 on Huggingface and GPT-4V (probable successor to OpenAI's GPT-3) to help build AI systems, especially for web scraping tasks. As a part of his work, he is experimenting with a retrieval augmented generation (RAG) to create an AI journaling assistant. This assistant extracts metadata from paragraphs such as emotions, people, and topics mentioned using GPT-4V and then summarises the paragraphs for quick memory extraction whenever a new entry is written. He also seems interested in exploring how LLMs can interact with browser extensions like Vimium for selecting screen elements, bypassing the need for mouse positions or passing the browser DOM (Document Object Model) as inputs. Additionally, he has shown interest in understanding the intricacies of model-training and metadata extraction from GPT, further evidenced by his interaction with other AI practitioners such as Matthew Barlow, Rob Haisfield, and Daniel George. While appreciating the improvements in RAG's accuracy mentioned by Ben Parr, James indicated interest in any planned updates for assistants' API regarding retrieval strategies. Jamesb is an enthusiast of large language models (LLMs), often exploring their applications in building natural language interfaces, voice cloning, and automated meal planning. His projects include a chat interface using transcripts of YouTuber Brett Hall and David Deutsch's cloned voice created with ElevenLabs, and a customised meal plan project, which assembles ingredients and adds them to a grocery cart. He also engages with work by creators like Arjun_Khemani, showcasing his interest in speech synthesis services like LMNT and ElevenLabs, and the EU Cyber Resilience Act.   He further extensively works on Spaced Repetition Systems (SRS), particularly when transforming these systems into engaging learning experiences. As a software developer, he enjoys coding for automations and has built the open-source project 'Open Fresh', which leverages artificial intelligence to prepare custom meal plans. James underscores the necessity of caution in the development of Artificial General Intelligence (AGI). He also takes part in discussions related to AI regulation and progress, Web scraping using selenium and LLMs, and GitHub Copilot. Jamesb enjoys sharing his work on GitHub and engaging in insightful discourse with the wider development community and AI enthusiasts. Jamesb is a software developer who is primarily interested in exploring the use of large language models (LLMs) for the development of comprehensive, interactive learning systems. His focus is on the Spaced Repetition System (SRS), particularly its application for enhancing learning experiences in various domains such as mathematics and software development. In addition to building SRS applications, Jamesb has made notable contributions to the development of innovative learning tools, with features such as incremental reading, writing, and video integration into RemNote, a digital note-taking app. Besides, his work stands out in the integration of artificial intelligence assistants for reflective journaling and the use of metaphoric systems for recommending new content. Acknowledging his fondness for Lean, a math-proof oriented programming language, Jamesb has developed exercise templates and a Lean plugin for RemNote, essentially modifying it to a digital tutor for math proofs. The exercise templates in conjunction with a robust SRS framework are part of his contribution to creating a more adaptive learning environment.   Beyond his work, Jamesb actively engages with the technology and AI community where he shares and discusses advancements in artificial intelligence, with particular interest in the development and implications surrounding GPT4 (Generative Pretrained Transformer 4). He is curious about the views industry thought leaders such as George Hotz, Melanie Mitchell, Michael Nielsen, and Douglas Hofstadter have on areas like AI risk and GPT4. Among his shared resources and content, there's also an evident interest in mathematics, reflected by his shared articles on introductory level mathematics principles and proofs. Jamesb's wide array of interests extends from building advanced learning systems to actively participating in conversations on emerging AI technologies while also expressing passion for educating students on mathematics principles and proofs.`;
    //   const customQuery = `How to solve sleep maintenance insomnia?`;
    //   const username = `experilearning`;
    //   const pipelineJobKey = randomUUID();
    //   const job = await addPipeline("twitter-pipeline-v1", {
    //     summary,
    //     queries: [customQuery],
    //     username,
    //     runId: pipelineJobKey,
    //     emailResults: true,
    //   });
    // })();
  })();
}
