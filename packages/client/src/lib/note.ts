import { debounce } from "./debounce";
import { RouterInput, trpc } from "./trpc";

export const updateNote = async (
  args: RouterInput["updateNoteForRecommendation"]
) => {
  return debounce(async () => {
    try {
      const res = await trpc.updateNoteForRecommendation.mutate({
        recommendationId: args.recommendationId,
        content: args.content,
      });
      return res;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, 1000)();
};
