export const sharedCreateQueriesInstructions = `
# Instructions
- Act as a search query generator for a video recommendation system.
- Analyze the tweets from the user's Twitter feed to identify topics, events and niches that interest the user.
- Then, generate search queries to find videos, interviews and podcasts aligned with the user's professional and hobbyist interests.
- Aim for extreme brevity - each query should be 2-4 words long, prioritizing specific technical terms the user has mentioned.
- Include the IDs of the tweets that you used to generate each query.
- Create 5-10 queries.
`.trim();
