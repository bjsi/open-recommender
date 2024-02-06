-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('running', 'completed', 'failed');

-- CreateTable
CREATE TABLE "PipelineRun" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'running',

    CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineTask" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "pipelineRunId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "isRetry" BOOLEAN NOT NULL DEFAULT false,
    "status" "TaskStatus" NOT NULL DEFAULT 'running',

    CONSTRAINT "PipelineTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PipelineRun" ADD CONSTRAINT "PipelineRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineTask" ADD CONSTRAINT "PipelineTask_pipelineRunId_fkey" FOREIGN KEY ("pipelineRunId") REFERENCES "PipelineRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
