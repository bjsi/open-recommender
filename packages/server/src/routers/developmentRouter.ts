import { router, publicProcedure } from "../trpc";

export const developmentRouter = router({
  createMockUser: publicProcedure.mutation(() => {}),
});
