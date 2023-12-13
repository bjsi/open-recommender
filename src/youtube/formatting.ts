import { SearchResult } from "./search";

export const searchResultsToString = (results: SearchResult[]) => {
  return results
    .map((r, idx) =>
      `
ID: ${idx}
Title: ${r.title}
Channel: ${r.channel}
Views: ${r.view_count}
Chapters:
${r.chapters?.map((c, idx) => idx + 1 + ". " + c.title).join("\n")}
`.trim()
    )
    .join("\n---\n");
};
