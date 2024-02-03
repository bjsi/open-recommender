import { TaskList, run } from "graphile-worker";
import { helloTask } from "./hello.task";
import { defineTask } from "./defineTask";

const registeredTasks: ReturnType<typeof defineTask<any>>[] = [helloTask];

const taskList = registeredTasks.reduce((acc, task) => {
  acc[task.task.identifier] = task.task.handler;
  return acc;
}, {} as TaskList);

async function main() {
  const runner = await run({
    concurrency: 3,
    noHandleSignals: false,
    pollInterval: 2000,
    taskList: taskList,
  });

  // Immediately await (or otherwise handle) the resulting promise, to avoid
  // "unhandled rejection" errors causing a process crash in the event of
  // something going wrong.
  await runner.promise;

  // If the worker exits (whether through fatal error or otherwise), the above
  // promise will resolve/reject.
}

(async () => {
  await main();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  helloTask.enqueue({ name: "world" });
})();
