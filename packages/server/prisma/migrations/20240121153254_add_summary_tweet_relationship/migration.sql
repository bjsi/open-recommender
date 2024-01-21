-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "summaryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
