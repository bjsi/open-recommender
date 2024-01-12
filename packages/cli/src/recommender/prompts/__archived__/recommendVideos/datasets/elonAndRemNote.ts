import { ExampleDataSet } from "prompt-iteration-assistant";
import {
  remnoteFlashcardsSearchResults,
  elonMuskSearchResults,
} from "../../../shared/exampleData";
import { interleaveArrays } from "../../../shared/interleaveArrays";
import { RecommendVideosInput } from "../schemas/recommendVideosInputSchema";
import { searchResultsToString } from "../../../../../youtube/formatting";

export const elonAndRemNoteSearchResults = interleaveArrays(
  remnoteFlashcardsSearchResults,
  elonMuskSearchResults
);

export const elonAndRemNote: ExampleDataSet<RecommendVideosInput> = {
  tweets: {
    name: "remnote flashcard home tweets",
    value: `
ID: 1
Liked by @experilearning
@remnote (2023-11-21)
Introducing the Flashcard Home! 🎉
Easily organize your flashcard practice and turn studying into a habit!
Prioritize based on your current goals.
Practice directly from any doc.
Visualize learning progress.
Pause cards not in use.
`.trim(),
  },
  results: {
    name: "elon and remnote results",
    value: searchResultsToString(elonAndRemNoteSearchResults),
  },
  query: {
    name: "flashcards home",
    value: "remnote flashcards home",
  },
};
