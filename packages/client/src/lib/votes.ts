import {
  VoteOnRecommendationInput,
  VoteOnRecommendationOutput,
} from "shared/schemas/voteOnRecommendation";
import { debounce } from "./debounce";

export async function voteOnRecommendation(args: VoteOnRecommendationInput) {
  return await debounce(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/vote", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(args),
      });
      const json: VoteOnRecommendationOutput = await res.json();
      console.log(json);
      return json.vote;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, 1000)();
}
