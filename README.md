<h1 align="center">
    <img src="https://raw.githubusercontent.com/bjsi/open-recommender/main/img/logo.webp" alt="Open Recommender Logo" height="200">
    <br/>
    Open Recommender - An open source, LLM-powered YouTube video recommendation system
</h1>

<h3 align="center">⚠️ Work in Progress... ⚠️</h3>

- [x] Build an MVP of the data pipeline
- [ ] Iterate on the prompts until 8/10 recommendations are good
- [ ] Curate fine tune dataset
- [ ] Create a website so people can sign up
- [ ] Collect more fine tune data
- [ ] Fine tune using [OpenPipe](https://openpipe.ai/)
- [ ] Scale to millions of users :D

<br/>

## 🚀 Overview

Welcome to Open Recommender, an open source recommendation system for YouTube.

## 🏆 Goals

- Understand your current interests by analyzing your Twitter engagement (likes, retweets, etc.)
- Create a large database of potentially interesting videos
- Recommend interesting sections from videos
- Recommend "timeless" content rather than "trending" content
- Surface "niche bangers" - difficult to find but really high quality content
- Biased towards learning as opposed to entertainment
- Read my blog post for more: [Building an LLM-Powered Open Source Recommendation System for YouTube](https://dev.to/experilearning/building-an-llm-powered-open-source-recommendation-system-40fg)

## How to Run

### Installation

- `git clone` this repo
- `cd open-recommender`
- `npm i`
- `python3 -m venv env`
- `source env/bin/activate`
- `pip install -r requirements.txt`
- Install [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- `cp .env.example .env` and fill in the values
- You need to create a fake Twitter account and create an `accounts.txt` file in the `src/twitter` folder with the account's credentials in the format `username:password:email:email_password`.
- `npm run main -u <twitter-username>` to run the full data pipeline

### Commands

- `npm run main -u <twitter-username>` to run the full data pipeline.
  - There are some other flags for re-running pipelines from a certain step, see `src/pipeline/main.ts`
  - Pipeline runs are saved in `src/pipeline/runs`.
  - This is really useful for debugging crashes or errors.
- `npm run test-prompts <optional prompt name>` to test the AI prompts (see `aiTests.ts`)
- `npm run yt:queries <twitter username>` to create a list of YouTube queries based on a user's twitter feed
- `npm run yt:filter` to test the YouTube search result filter.
- `npm run yt:search <query>` to test YouTube search
- `npm run yt:transcript <optional videoId>` to test downloading and parsing YouTube transcripts
- `npm run yt:chunk` to test chunking YouTube transcripts into clips
- `npm run twitter:context` to test getting a user's bio and tweets

## 📚 How it Works

A summary of the data pipeline:

- Download a user's Twitter data (tweets, likes, retweets, etc.)
- Create a list of search queries to find interesting YouTube videos based on the user's Twitter data
- Search YouTube for videos based using the queries
- Filter videos based on how relevant they are to the user
- Download transcripts and chunk them into clips
- Create a database of video chunks
- Recommend videos to the user

See more detailed working notes [here](https://www.remnote.com/a/YouTube-Recommender/655daa97d42611e86f8536ec)

## Papers and Blog Posts
- [Building an LLM-Powered Open Source Recommendation System for YouTube](https://dev.to/experilearning/building-an-llm-powered-open-source-recommendation-system-40fg)
- [BookGPT: A General Framework for Book Recommendation Based on a Large Language Model](https://arxiv.org/pdf/2305.15673.pdf)
- [A Survey on Large Language Models for Recommendation](https://arxiv.org/abs/2305.19860)
- [Recommender Systems in the Era of Large Language Models (LLMs)](https://arxiv.org/abs/2307.02046)
