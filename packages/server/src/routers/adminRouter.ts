import { router, publicProcedure } from "../trpc";

// adminRoutes.post("/add-recommendation");

export const adminRouter = router({
  addRecommendation: publicProcedure.mutation(() => {
    // ...
    return [];
  }),
});
