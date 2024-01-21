/*
  Warnings:

  - A unique constraint covering the columns `[tweetId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tweetId` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "tweetId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweetId_key" ON "Tweet"("tweetId");
