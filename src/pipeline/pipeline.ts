import { z } from "zod";
import {
  Failure,
  Success,
  createRun,
  failure,
  getRunById,
  saveRun,
} from "./run";

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
  user: z.string(),
  searchFilterRelevancyCutOff: z.number().min(0).max(1).default(0.65),
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

  async execute(): Promise<Success<T> | Failure> {
    if (!this.stages.length) {
      return failure("No stages added to pipeline");
    }
    const stage1 = this.stages[0];
    let args = await this.executeStage(stage1, this.initialValue);
    this.saveStage(stage1, args);
    if (!args.success) {
      return args;
    }
    for (let i = 1; i < this.stages.length; i++) {
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
