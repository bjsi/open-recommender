import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AdminRouter, AppRouter } from "server/src/main";

const customFetch = async (url: any, options: any) => {
  const enhancedOptions: RequestInit = {
    ...options,
    credentials: "include", // Include credentials
    headers: {
      ...(options?.headers ?? {}),
    },
  };
  return fetch(url, enhancedOptions);
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_SERVER_URL! + "/api",
      fetch: customFetch,
    }),
  ],
});

export const trpcAdmin = createTRPCClient<AdminRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_SERVER_URL! + "/admin",
      fetch: customFetch,
    }),
  ],
});

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type AdminRouterInput = inferRouterInputs<AdminRouter>;
export type AdminRouterOutput = inferRouterOutputs<AdminRouter>;
