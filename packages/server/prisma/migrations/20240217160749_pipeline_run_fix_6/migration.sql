/*
  Warnings:

  - Added the required column `updatedAt` to the `PipelineTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PipelineTask" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "PipelineTaskLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pipelineTaskId" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "log" TEXT NOT NULL,

    CONSTRAINT "PipelineTaskLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PipelineTaskLog" ADD CONSTRAINT "PipelineTaskLog_pipelineTaskId_fkey" FOREIGN KEY ("pipelineTaskId") REFERENCES "PipelineTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
