/*
  Warnings:

  - You are about to drop the column `isRetry` on the `PipelineTask` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'retrying';

-- AlterTable
ALTER TABLE "PipelineTask" DROP COLUMN "isRetry";
