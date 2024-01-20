import { getInputFromCLI, searchList } from "prompt-iteration-assistant";
import { loadExampleTweetHistory } from "../../twitter/getUserContext";
import { search } from "../../youtube/search";
import { fetchTranscript } from "../../youtube/transcript";
import { recommendClips } from "../prompts/recommendClips/recommendClips";
import { rerankClips } from "../prompts/rerankClips/rerankClips";
import _ from "remeda";

export async function getUser() {
  const user = await getInputFromCLI("Twitter @username");
  return user;
}

export async function getQuery() {
  const query = await getInputFromCLI("YouTube search query");
  return query;
}

export async function searchAndChunk() {
  const user = await getUser();
  // get tweets from user
  // TODO: use real tweets
  const tweets = loadExampleTweetHistory(user).slice(0, 20);
  if (!tweets || tweets.length === 0) {
    console.error("Failed to fetch tweets for", user);
    process.exit(1);
  }
  const query = await getQuery();
  console.log("Searching for videos...");
  const results = await search({ query });
  if (!results) {
    console.error("Failed to search for videos");
    process.exit(1);
  }
  const videoTitle = await searchList({
    message: "Pick a video:",
    choices: results.map((r) => r.title),
  });
  const chosenVideo = results.find((r) => r.title === videoTitle);
  if (!chosenVideo) {
    console.error("Invalid video");
    process.exit(1);
  }
  const transcript = await fetchTranscript(chosenVideo.id, chosenVideo.title);
  if (!transcript) {
    console.error("Failed to fetch transcript");
    process.exit(1);
  }
  const clips = await recommendClips().execute({
    tweets,
    user,
    url: `https://www.youtube.com/watch?v=${chosenVideo.id}`,
    title: chosenVideo.title,
    transcript: transcript.cues,
    videoId: chosenVideo.id,
    profile:
      "@experilearning is a software developer deeply engrossed in the fields of Language Learning Models (LLMs), Spaced Repetition Systems (SRS), and Artificial General Intelligence (AGI). They're actively involved in the development of an app named RemNote and an Open Recommender System. Their interest lies in enhancing learning technologies and building innovative strategies to make learning more engaging through merging social media feed with spaced repetition review. Evident from their tweets, they are enthusiastic about programming mechanisms, error recovery in coding, prompt chains, and other technical aspects related to AI and machine learning. They are advocates for internet freedom, favoring RSS style information dissemination. They are active in discussions about talent constraint, AI safety, and are fond of podcasts like Joe Walker's and Dwarkesh's for fresh perspectives. They constantly share new articles, thoughts, and are part of insightful discussions on platforms like OpenPipeAI, DSPy. They take inspiration from figures like David Deutsch and eagerly await content like @dela3499's video on AGI principles. @experilearning is an active developer with a strong interest in building innovative software solutions, particularly in the areas of advanced 'Language Model' (LLM) technologies and Spaced Repetition Systems (SRS). The user has been working on creating robust data pipelines and handling complex debugging. They devote considerable effort to creating a recommendation system named 'Open Recommender', which leverage LLMs to provide personalized recommendations based on Twitter input. They have a vision of combining learning with the engaging characteristics of binge-watching YouTube shorts. @experilearning is deeply interested in artificial intelligence (AI), machine learning, recommendation systems, and language models. They are building a Spaced Repetition System (SRS) app called RemNote and often communicate with other tech developers like ErikBjare and bryancsk. They have shared resources on creating YouTube recommender systems and predict the resurgence of RSS reader-style internet consumption in conjunction with personalized content recommendation agents. @experilearning is strongly interested in the development and application of LLM (Large Language Models) as evident by his discussions about using fuzzy substring search for citation validation in language tasks. He shares strong opinions about implementing citation validation without LLMs and explains his methodology behind this. His interest extends to developing SRS (spaced repetition software) applications as he mentions building the SRS app @rem_note, tagging other users in his tweet about using fuzzy search to generate citation pins for flashcards within the application. Beyond the technical interests, he seems keen on organizing events, commenting about hosting an Oxford e/acc meetup and getting other users on board for the planning phases. @experilearning's tweets show a deep interest in AI technology, specifically in its application to personalize learning and improve productivity. Experilearning is evidently interested in the latest advancements in Lifelong Learning Machines (LLMs), especially in the context of assistive applications and technology designed to improve productivity. The user has a particular focus on SRS (Spaced Repetition Software) and is actively involved in developing an SRS application known as RemNote. Experilearning demonstrates an affinity for web scraping using Selenium to build browser agents and improve workflow efficiency through innovative approaches. The user is involved in discussions about OpenAI’s RAG (Retrieval Augmented Generation) strategy in their new Assistants Retrieval tool, implying an underlying interest in AI and machine learning. Additionally, tweets and replies indicate Experilearning's clear interest in OpenAI's recent endeavors, including document embedding techniques and vector search. Experilearning shows an interest in tech policies and critiques the UK Government's commitment to being a tech leader. Interactions with other Twitter users also suggest an attraction to applications of multi-modal inputs in AI, using tools like llama.cpp and ModelFusion, even considering potential use cases in fitness and real-time feedback. Exploring the powerful models and their potential applications, the user also expresses curiosity about fine-tuning models like GPT-3.5 to generate code for APIs not in the LLM's training set. The user @experilearning shows a strong interest in artificial intelligence and machine learning, with particular emphasis on Long-Lived Agents (LLM) and Spaced Repetition Systems (SRS). They express concern about AI safety, specifically in the context of massive model training runs and the potential risks they pose, with references to Anthropic CEO's p(doom) probability. They have a strong fascination with knowledge creation, evident in their interactions with posts discussing the endless possibilities of hypothesis generation in human minds. They appear to be heavily involved in coding and web scraping, with mentions of using selenium for web scraping and improving the process with GPT. They also discuss GitHub Copilot and its potential improvements by incorporating type information from compilers. Their interest extends to mathematical creation, citing Henri Poincaré's work, and contributions to the online Remnote community, indicating an interest in collaborative learning and educational content creation. They show admiration of companies with scaled ingredient distribution like hello fresh, hinting at an interest in efficient systems and AI-planned meals. Their comments also suggest an interest in the accessibility of technology, health, and longevity, likening the universality of iPhone ownership to future developments in medicine and longevity.",
  });
  console.log(clips);
  return {
    clips,
    tweets,
    results,
    query,
    user,
  };
}

export async function searchChunkAndRank() {
  const { clips, tweets, results, query, user } = await searchAndChunk();
  const shuffledClips = _.shuffle(clips);
  const rankedClips = await rerankClips().execute({
    tweets,
    user,
    clips: shuffledClips,
    profile:
      "@experilearning is a software developer deeply engrossed in the fields of Language Learning Models (LLMs), Spaced Repetition Systems (SRS), and Artificial General Intelligence (AGI). They're actively involved in the development of an app named RemNote and an Open Recommender System. Their interest lies in enhancing learning technologies and building innovative strategies to make learning more engaging through merging social media feed with spaced repetition review. Evident from their tweets, they are enthusiastic about programming mechanisms, error recovery in coding, prompt chains, and other technical aspects related to AI and machine learning. They are advocates for internet freedom, favoring RSS style information dissemination. They are active in discussions about talent constraint, AI safety, and are fond of podcasts like Joe Walker's and Dwarkesh's for fresh perspectives. They constantly share new articles, thoughts, and are part of insightful discussions on platforms like OpenPipeAI, DSPy. They take inspiration from figures like David Deutsch and eagerly await content like @dela3499's video on AGI principles. @experilearning is an active developer with a strong interest in building innovative software solutions, particularly in the areas of advanced 'Language Model' (LLM) technologies and Spaced Repetition Systems (SRS). The user has been working on creating robust data pipelines and handling complex debugging. They devote considerable effort to creating a recommendation system named 'Open Recommender', which leverage LLMs to provide personalized recommendations based on Twitter input. They have a vision of combining learning with the engaging characteristics of binge-watching YouTube shorts. @experilearning is deeply interested in artificial intelligence (AI), machine learning, recommendation systems, and language models. They are building a Spaced Repetition System (SRS) app called RemNote and often communicate with other tech developers like ErikBjare and bryancsk. They have shared resources on creating YouTube recommender systems and predict the resurgence of RSS reader-style internet consumption in conjunction with personalized content recommendation agents. @experilearning is strongly interested in the development and application of LLM (Large Language Models) as evident by his discussions about using fuzzy substring search for citation validation in language tasks. He shares strong opinions about implementing citation validation without LLMs and explains his methodology behind this. His interest extends to developing SRS (spaced repetition software) applications as he mentions building the SRS app @rem_note, tagging other users in his tweet about using fuzzy search to generate citation pins for flashcards within the application. Beyond the technical interests, he seems keen on organizing events, commenting about hosting an Oxford e/acc meetup and getting other users on board for the planning phases. @experilearning's tweets show a deep interest in AI technology, specifically in its application to personalize learning and improve productivity. Experilearning is evidently interested in the latest advancements in Lifelong Learning Machines (LLMs), especially in the context of assistive applications and technology designed to improve productivity. The user has a particular focus on SRS (Spaced Repetition Software) and is actively involved in developing an SRS application known as RemNote. Experilearning demonstrates an affinity for web scraping using Selenium to build browser agents and improve workflow efficiency through innovative approaches. The user is involved in discussions about OpenAI’s RAG (Retrieval Augmented Generation) strategy in their new Assistants Retrieval tool, implying an underlying interest in AI and machine learning. Additionally, tweets and replies indicate Experilearning's clear interest in OpenAI's recent endeavors, including document embedding techniques and vector search. Experilearning shows an interest in tech policies and critiques the UK Government's commitment to being a tech leader. Interactions with other Twitter users also suggest an attraction to applications of multi-modal inputs in AI, using tools like llama.cpp and ModelFusion, even considering potential use cases in fitness and real-time feedback. Exploring the powerful models and their potential applications, the user also expresses curiosity about fine-tuning models like GPT-3.5 to generate code for APIs not in the LLM's training set. The user @experilearning shows a strong interest in artificial intelligence and machine learning, with particular emphasis on Long-Lived Agents (LLM) and Spaced Repetition Systems (SRS). They express concern about AI safety, specifically in the context of massive model training runs and the potential risks they pose, with references to Anthropic CEO's p(doom) probability. They have a strong fascination with knowledge creation, evident in their interactions with posts discussing the endless possibilities of hypothesis generation in human minds. They appear to be heavily involved in coding and web scraping, with mentions of using selenium for web scraping and improving the process with GPT. They also discuss GitHub Copilot and its potential improvements by incorporating type information from compilers. Their interest extends to mathematical creation, citing Henri Poincaré's work, and contributions to the online Remnote community, indicating an interest in collaborative learning and educational content creation. They show admiration of companies with scaled ingredient distribution like hello fresh, hinting at an interest in efficient systems and AI-planned meals. Their comments also suggest an interest in the accessibility of technology, health, and longevity, likening the universality of iPhone ownership to future developments in medicine and longevity.",
  });
  console.log("ranked");
  console.log(rankedClips);
}
