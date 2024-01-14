import {
  GetNoteForRecommendationInput,
  GetNoteForRecommendationOutput,
  UpdateNoteForRecommendationInput,
  UpdateNoteForRecommendationOutput,
} from "shared/schemas/getNotes";
import { debounce } from "./debounce";

export async function getNote(args: GetNoteForRecommendationInput) {
  try {
    const res = await fetch(
      "http://localhost:3000/api/get-note-for-recommendation",
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(args),
      }
    );
    const json: GetNoteForRecommendationOutput = await res.json();
    console.log(json);
    return json.note;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function updateNote(args: UpdateNoteForRecommendationInput) {
  return await debounce(async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/update-note-for-recommendation",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
          body: JSON.stringify(args),
        }
      );
      const json: UpdateNoteForRecommendationOutput = await res.json();
      console.log(json);
      return json.success;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, 1000)();
}
