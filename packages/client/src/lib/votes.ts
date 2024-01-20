import { debounce } from "./debounce";
import { RouterInput, trpc } from "./trpc";

export const voteOnRecommendation = async (
  args: RouterInput["voteOnRecommendation"]
) =>
  await debounce(async () => {
    try {
      const res = await trpc.voteOnRecommendation.mutate({
        recommendationId: args.recommendationId,
        vote: args.vote,
      });
      return res;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, 1000)();
