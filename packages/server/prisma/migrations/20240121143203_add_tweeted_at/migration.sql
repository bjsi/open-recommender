/*
  Warnings:

  - Added the required column `tweetedAt` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "tweetedAt" TIMESTAMP(3) NOT NULL;
