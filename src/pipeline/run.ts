import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { z } from "zod";
import { pipelineRunsFolder } from "../filesystem";

const successSchema = z.object({
  success: z.literal(true),
  result: z.any(),
});

export interface Success<T> {
  success: true;
  result: T;
}

const failureSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export interface Failure {
  success: false;
  error: string;
}

const runResultSchema = z.union([successSchema, failureSchema]);

export const success = <T>(result: T) =>
  ({
    success: true,
    result,
  } as const);

export const failure = (error: string) =>
  ({
    success: false,
    error,
  } as const);

export const runSchema = z.object({
  id: z.string(),
  stages: z.array(
    z.object({
      name: z.string(),
      result: runResultSchema,
    })
  ),
});

export type Run = z.infer<typeof runSchema>;

export const getRunById = (id: string) => {
  const maybeRun = runSchema.safeParse(
    JSON.parse(
      readFileSync(path.join(pipelineRunsFolder, `${id}.json`), "utf8")
    )
  );
  return maybeRun.success ? maybeRun.data : undefined;
};

export const saveRun = (run: z.infer<typeof runSchema>) => {
  const runId = run.id;
  const runPath = path.join(pipelineRunsFolder, `${runId}.json`);
  writeFileSync(runPath, JSON.stringify(run, null, 2), "utf8");
};

export const createRun = (runId: string) => {
  const run: Run = {
    id: runId,
    stages: [],
  };
  saveRun(run);
  return run;
};
