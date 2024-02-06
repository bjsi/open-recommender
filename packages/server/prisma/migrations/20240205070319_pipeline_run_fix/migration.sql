/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `PipelineRun` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId]` on the table `PipelineTask` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `jobId` on the `PipelineRun` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `jobId` on the `PipelineTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PipelineRun" DROP COLUMN "jobId",
ADD COLUMN     "jobId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PipelineTask" DROP COLUMN "jobId",
ADD COLUMN     "jobId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PipelineRun_jobId_key" ON "PipelineRun"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineTask_jobId_key" ON "PipelineTask"("jobId");
