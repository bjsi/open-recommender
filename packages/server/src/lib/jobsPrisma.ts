import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export async function getPipelineJobByKey(key: string): Promise<{
  id: number;
}> {
  return (
    await prisma.$queryRaw<any[]>(
      Prisma.sql`SELECT * FROM graphile_worker.jobs WHERE key = ${key}`
    )
  )[0];
}

export async function getPipelineTaskJobById(id: string): Promise<{
  id: number;
}> {
  const raw = await prisma.$queryRaw<any[]>(
    Prisma.sql`SELECT * FROM graphile_worker.jobs WHERE id = ${id}::bigint`
  );
  console.log("getPipelineTaskJobById", raw);
  return raw[0];
}

interface Job {
  id: number;
  queue_name: string | null;
  task_identifier: string;
  priority: number;
  run_at: Date;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  created_at: Date;
  updated_at: Date;
  key: string | null;
}

export async function getGraphileJobs(): Promise<any[]> {
  return await prisma.$queryRaw<any[]>(
    Prisma.sql`SELECT * FROM graphile_worker.jobs`
  );
}
