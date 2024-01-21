import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AdminRouter } from "server/src/main";
import dotenv from "dotenv";

dotenv.config();

const customFetch = async (url: any, options: any) => {
  const enhancedOptions: RequestInit = {
    ...options,
    headers: {
      ...(options?.headers ?? {}),
      "x-api-key": process.env.OPEN_RECOMMENDER_API_KEY!,
    },
  };
  return fetch(url, enhancedOptions);
};

export const trpc = createTRPCClient<AdminRouter>({
  links: [
    httpBatchLink({
      url: process.env.SERVER_URL! + "/admin",
      fetch: customFetch,
    }),
  ],
});

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AdminRouter>;
export type RouterOutput = inferRouterOutputs<AdminRouter>;
