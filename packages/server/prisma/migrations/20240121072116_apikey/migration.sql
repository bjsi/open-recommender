/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_recommendationId_fkey";

-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_summaryId_fkey";

-- DropForeignKey
ALTER TABLE "QueryToRecommendationSource" DROP CONSTRAINT "QueryToRecommendationSource_queryId_fkey";

-- DropForeignKey
ALTER TABLE "QueryToRecommendationSource" DROP CONSTRAINT "QueryToRecommendationSource_recommendationSourceId_fkey";

-- DropForeignKey
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_recommendationSourceId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecommendation" DROP CONSTRAINT "UserRecommendation_recommendationId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_recommendationId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_recommendationSourceId_fkey" FOREIGN KEY ("recommendationSourceId") REFERENCES "RecommendationSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryToRecommendationSource" ADD CONSTRAINT "QueryToRecommendationSource_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryToRecommendationSource" ADD CONSTRAINT "QueryToRecommendationSource_recommendationSourceId_fkey" FOREIGN KEY ("recommendationSourceId") REFERENCES "RecommendationSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendation" ADD CONSTRAINT "UserRecommendation_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
