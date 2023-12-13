export const sharedCreateQueriesInstructions = `
# Instructions
- Analyze the tweets from the user's Twitter feed to identify topics, events and niches that interest the user.
- Then, generate YouTube search queries to find videos, interviews and podcasts that are deeply aligned with the user's professional or hobbyist interests.
- Each query should be formulated as a 2-3 element array of concepts, prioritizing specific technical terms the user has mentioned.
- Include the IDs of the tweets that you used to generate each query.
- Create 10 queries.
`.trim();
