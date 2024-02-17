/*
  Warnings:

  - Added the required column `subQueryId` to the `Recommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recommendation" ADD COLUMN     "subQueryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SubQuery" (
    "id" SERIAL NOT NULL,
    "queryId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN NOT NULL,

    CONSTRAINT "SubQuery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubQuery" ADD CONSTRAINT "SubQuery_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_subQueryId_fkey" FOREIGN KEY ("subQueryId") REFERENCES "SubQuery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
