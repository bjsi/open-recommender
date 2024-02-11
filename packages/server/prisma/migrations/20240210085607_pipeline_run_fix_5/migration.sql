/*
  Warnings:

  - You are about to drop the column `jobId` on the `PipelineRun` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobKeyId]` on the table `PipelineRun` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobKeyId` to the `PipelineRun` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PipelineRun_jobId_key";

-- AlterTable
ALTER TABLE "PipelineRun" DROP COLUMN "jobId",
ADD COLUMN     "jobKeyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PipelineRun_jobKeyId_key" ON "PipelineRun"("jobKeyId");
