/*
  Warnings:

  - Added the required column `content` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "useForRecommendations" BOOLEAN NOT NULL DEFAULT true;
