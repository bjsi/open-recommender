-- DropForeignKey
ALTER TABLE "PipelineTaskLog" DROP CONSTRAINT "PipelineTaskLog_pipelineTaskId_fkey";

-- AddForeignKey
ALTER TABLE "PipelineTaskLog" ADD CONSTRAINT "PipelineTaskLog_pipelineTaskId_fkey" FOREIGN KEY ("pipelineTaskId") REFERENCES "PipelineTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
