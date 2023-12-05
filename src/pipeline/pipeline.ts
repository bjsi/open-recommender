import { z } from "zod";
import {
  Either,
  Failure,
  Success,
  createRun,
  failure,
  getRunById,
  saveRun,
} from "./run";
import { STAGES } from "./stages";

export type PipelineFunction<T, U> = (
  input: T
) => Promise<Success<U> | Failure>;
export type PipelineStage<T, U> = {
  name: string;
  description: string;
  run: PipelineFunction<T, U>;
};

export const pipelineArgsSchema = z.object({
  runId: z.string(),
  cloneRunId: z.string().optional(),
  user: z.string(),
  searchFilterRelevancyCutOff: z.number().min(0).max(1).default(0.65),
  stage: z.enum(STAGES).optional(),
});

export type PipelineArgs = z.infer<typeof pipelineArgsSchema>;

export class Pipeline<T extends PipelineArgs> {
  private stages: PipelineStage<any, any>[] = [];

  constructor(private readonly initialValue: T) {}

  private saveStage(
    stage: PipelineStage<any, any>,
    result: Success<any> | Failure
  ) {
    const run =
      getRunById(this.initialValue.runId) || createRun(this.initialValue.runId);
    run.stages.push({
      name: stage.name,
      result,
    });
    saveRun(run);
  }

  private async executeStage<T>(stage: PipelineStage<T, any>, args: T) {
    try {
      return await stage.run(args);
    } catch (e) {
      return failure(`Error thrown while running stage ${stage.name}: ${e}`);
    }
  }

  addStage<U extends PipelineArgs>(stage: PipelineStage<T, U>): Pipeline<U> {
    this.stages.push(stage);
    return this as any;
  }

  async execute(): Promise<Either<T>> {
    if (!this.stages.length) {
      return failure("No stages added to pipeline");
    }
    const clonedRun = this.initialValue.cloneRunId
      ? getRunById(this.initialValue.cloneRunId)
      : undefined;
    if (this.initialValue.cloneRunId && !clonedRun) {
      return failure(
        `Failed to clone Run. Run with ID "${this.initialValue.cloneRunId}" not found`
      );
    }
    const startIndex = this.initialValue.stage
      ? this.stages.findIndex((s) => s.name === this.initialValue.stage)
      : 0;
    if (startIndex === -1) {
      return failure(`Stage ${this.initialValue.stage} not found`);
    }

    const prevStage = clonedRun?.stages?.[startIndex - 1];
    const stage1 = this.stages[startIndex];

    console.log("Running pipeline with ID", this.initialValue.runId);
    if (clonedRun) {
      saveRun({
        ...clonedRun,
        id: this.initialValue.runId,
        stages: clonedRun.stages.slice(0, startIndex - 1),
      });
      console.log("Loading cloned run with ID", clonedRun.id);
    }
    if (startIndex > 0) {
      console.log(
        "Starting from stage",
        stage1.name,
        "with previous stage",
        prevStage?.name
      );
    }

    let args = (
      !clonedRun || !prevStage
        ? await this.executeStage(stage1, this.initialValue)
        : prevStage.result
    ) as Either<T>;

    this.saveStage(stage1, args);
    if (!args.success) {
      return args;
    }
    for (let i = startIndex; i < this.stages.length; i++) {
      const currentStage = this.stages[i];
      args = await this.executeStage(currentStage, args.result);
      this.saveStage(currentStage, args);
      if (!args.success) {
        break;
      }
    }
    return args;
  }
}
