import { defineTask } from "./defineTask";

export const helloTask = defineTask<{ name: string }>({
  id: "hello",
  handler: async (payload) => {
    console.log(`Hello, ${payload.name}`);
  },
});
