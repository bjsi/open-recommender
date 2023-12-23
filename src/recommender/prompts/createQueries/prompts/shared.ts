export const sharedCreateQueriesInstructions = `
# Instructions
- Act as a query generator for a YouTube video recommendation system.
- Analyze the tweets from the user's Twitter feed to identify topics, events and niches that interest the user.
- Then, generate search queries to find videos, interviews and podcasts that are deeply aligned with the user's professional and hobbyist interests.
- Each query should be formulated as a 2-3 element array of concepts, prioritizing specific technical terms the user has mentioned.
- Aim for extreme brevity and specificity with the query arrays.
- Include the IDs of the tweets that you used to generate each query.
- Create 10 queries.
`.trim();
