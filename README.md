<h1 align="center">
    <img src="https://raw.githubusercontent.com/bjsi/open-recommender/main/img/logo.webp" alt="Open Recommender Logo" height="200">
    <br/>
    Open Recommender - An open source AI-powered recommendation system for videos and articles
</h1>

<h3 align="center">⚠️ Work in Progress... ⚠️</h3>

## 🚀 Overview

Welcome to Open Recommender, an open source AI-powered recommendation system for videos and articles.

## 🏆 Goals

- Understand your current interests by analyzing things like your Twitter engagement (likes, retweets, etc.) and other data sources.
- Search the web for interesting content to recommend to you
- Recommend interesting sections from videos
- Recommend "timeless" content rather than "trending" content
- Surface "niche bangers" - difficult to find but really high quality content
- Biased towards learning as opposed to entertainment
- Read my blog post for more: [Building an LLM-Powered Open Source Recommendation System for YouTube](https://dev.to/experilearning/building-an-llm-powered-open-source-recommendation-system-40fg)
- [Create a system that borrows the best elements from YouTube Shorts, TikTok and incremental reading to create something that feels as effortless and engaging as a queue of YouTube shorts but actually helps you make progress towards meaningful goals](https://experimentallearning.substack.com/p/from-spaced-repetition-systems-to)

## How to Run

### Installation

- `git clone` this repo
- `cd open-recommender`
- `yarn && yarn build`
- `python3 -m venv env`
- `source env/bin/activate`
- `pip install -r requirements.txt`
- In the client, server and cli packages, `cp .env.example .env` and fill in the values
- If you want to use Twitter as an input data source for recommendations, you need to create a fake Twitter account and create an `accounts.txt` file in the root folder with the account's credentials in the format `username:password:email:email_password`.

### Running

- `yarn server` to run the backend
- `yarn client` to run the frontend
- `yarn worker` to run the background job worker
- Open up the web client and click the login button in the top right.
- After logging in using Twitter this will automatically trigger a new recommendations pipeline run task for the worker.
- You can monitor a recommendations pipeline run using by navigating to http://localhost:5173/#/admin. Make sure you set ADMIN="Your Twitter Username" in the server `.env` file.
- After a run is finished you can view your queue of recommendations by navigating to your feed.

### Commands

## 📚 How it Works

A summary of the data pipeline:

- Download a user's Twitter data (tweets, likes, retweets, etc.)
- Recursively summarize into a user profile
- Generate search queries using the user's profile
- Search for videos and articles based using the queries
- Download transcripts and articles and chunk them into "clips"
- Recommend the best clips to the user in clusters (like mini learning playlists)

## Papers and Blog Posts

- [Building an LLM-Powered Open Source Recommendation System for YouTube](https://dev.to/experilearning/building-an-llm-powered-open-source-recommendation-system-40fg)
- [BookGPT: A General Framework for Book Recommendation Based on a Large Language Model](https://arxiv.org/pdf/2305.15673.pdf)
- [A Survey on Large Language Models for Recommendation](https://arxiv.org/abs/2305.19860)
- [Recommender Systems in the Era of Large Language Models (LLMs)](https://arxiv.org/abs/2307.02046)
