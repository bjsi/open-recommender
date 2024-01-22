/*
  Warnings:

  - You are about to drop the column `data` on the `Summary` table. All the data in the column will be lost.
  - Added the required column `content` to the `Summary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `UserRecommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "data",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserRecommendation" ADD COLUMN     "priority" INTEGER NOT NULL;
