/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `RecommendationSource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public` to the `Query` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `RecommendationSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Query" ADD COLUMN     "public" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Recommendation" ADD COLUMN     "public" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "RecommendationSource" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "QueryToRecommendationSource" (
    "id" SERIAL NOT NULL,
    "queryId" INTEGER NOT NULL,
    "recommendationSourceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueryToRecommendationSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationSource_externalId_key" ON "RecommendationSource"("externalId");

-- AddForeignKey
ALTER TABLE "QueryToRecommendationSource" ADD CONSTRAINT "QueryToRecommendationSource_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryToRecommendationSource" ADD CONSTRAINT "QueryToRecommendationSource_recommendationSourceId_fkey" FOREIGN KEY ("recommendationSourceId") REFERENCES "RecommendationSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
