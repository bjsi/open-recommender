export const sharedCreateQueriesInstructions = (args: { short: boolean }) =>
  `
# Instructions
- Your job is to analyze the user's profile to identify ideas, concepts, problems, people and events that interest them.
- Then you should brainstorm a list of 10 questions the user would be interested in researching.
- DO NOT USE ACRONYMS OR ABBREVIATIONS, ALWAYS USE THE FULL NAME WITH THE ACRONYM IN PARANTHESES.
`.trim();
