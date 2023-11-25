<h1 align="center">
    <img src="/img/logo.webp" alt="Open Recommender Logo" height="200">
    <br/>
    Open Recommender - An open source, LLM-powered YouTube video recommendation system
</h1>

<h3 align="center">⚠️ Work in Progress... ⚠️</h3>
The current focus is on building out the data pipeline for searching and downloading YouTube videos and transcripts. The next step will be to build out the recommendation system itself.

<br/>

## 🚀 Overview

Welcome to Open Recommender, an open source recommendation system for YouTube.

## 🏆 Goals

- Understand your current interests by analyzing your Twitter engagement (likes, retweets, etc.)
- Create a large database of potentially interesting videos
- Recommend interesting sections from videos
- Recommend "timeless" content
- Surface "niche bangers" - difficult to find but really high quality content
- Biased towards learning as opposed to entertainment

## How to Run

### Installation

- `git clone` this repo
- `cd open-recommender`
- `npm i`
- Install [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- `cp .env.example .env` and fill in the values

### Commands

- `npm run test-prompts <optional prompt name>` to test the AI prompts (see `aiTests.ts`)
- `npm run yt:search <query>` to test YouTube search
- `npm run yt:transcript <optional videoId>` to test downloading and parsing YouTube transcripts
- `npm run yt:queries <optional user context>` to create a list of YouTube queries based on a user's context
- `npm run main <optional user context>` to run the full data pipeline

## 📚 How it Works

A summary of the data pipeline:

- Create a list of search queries to find interesting YouTube videos based on a user's Twitter engagement
- Search YouTube
- Filter videos based on how relevant they are to the user's context
- Download transcripts and chunk them into smaller sections with metadata
- Create a database of video chunks
- Give recommendations to the user based on a mixture of their current and past interests

See more detailed working notes [here](https://www.remnote.com/a/YouTube-Recommender/655daa97d42611e86f8536ec)

## Related Papers and Blog Posts

- [BookGPT: A General Framework for Book Recommendation Based on a Large Language Model](https://arxiv.org/pdf/2305.15673.pdf)
- [A Survey on Large Language Models for Recommendation](https://arxiv.org/abs/2305.19860)
- [Recommender Systems in the Era of Large Language Models (LLMs)](https://arxiv.org/abs/2307.02046)
