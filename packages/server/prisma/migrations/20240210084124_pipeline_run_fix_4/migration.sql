/*
  Warnings:

  - You are about to drop the column `userId` on the `PipelineRun` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `PipelineTask` table. All the data in the column will be lost.
  - Added the required column `username` to the `PipelineRun` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PipelineRun" DROP CONSTRAINT "PipelineRun_userId_fkey";

-- AlterTable
ALTER TABLE "PipelineRun" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PipelineTask" DROP COLUMN "data";
