import { Button } from "@react-email/button";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Img,
  Link,
  Column,
} from "@react-email/components";
import React from "react";
import { AddRecommendationInput } from "../addRecomendations";
import { youtubeIdToThumbnailUrl } from "shared/src/youtube";

interface RecommendationsEmailProps {
  input: AddRecommendationInput;
}

const debug = false;

const defaults: RecommendationsEmailProps = {
  input: {
    username: "experilearning",
    clips: {
      "How can the integration of large language models in Spaced Repetition Systems improve learning outcomes?":
        {
          "How can the integration of large language models in Spaced Repetition Systems improve learning outcomes?":
            [
              {
                type: "article",
                title:
                  "How can the integration of large language models in Spaced Repetition Systems improve learning outcomes?",
                question:
                  "How can the integration of large language models in Spaced Repetition Systems improve learning outcomes?",
                text: "As we continue to revolutionize learning and personal development, we believe that these findings will contribute significantly to the ongoing refinement and improvement of SuperMemo. Our journey in perfecting spaced repetition algorithms has always been about providing the best possible learning experience for you. With this new research, we aim to continue our tradition of innovation and excellence, making SuperMemo even more effective and adaptive to your learning needs.",
                articleTitle:
                  "AI in SuperMemo: Pioneering Spaced Repetition with LSTMs",
                articleUrl:
                  "https://www.supermemo.com/en/blog/ai-in-supermemo?drc=1",
              },
              {
                type: "article",
                title:
                  "How can the integration of large language models in Spaced Repetition Systems improve learning outcomes?",
                question:
                  "How can the integration of large language models in Spaced Repetition Systems improve learning outcomes?",
                text: "Improving behavior over longer periods of time Because our algorithm is based on the principles of spaced repetition, it should in theory behave like other spaced repetition algorithms and, over the course of many days, introduce longer and longer delays between each time a term is studied. However, in practice, because we assumed a simple exponential decay forgetting curve and trained our model on a random sample of Quizlet data which is heavily biased towards time ranges of under a couple days, our model isn’t very sensitive to time changes over longer periods of time. But we can address that by sampling our data to include more long-term study behavior, and by modelling the time components more flexibly (not assuming a strict exponential relationship). That will allow us to build an algorithm that works great whether a student crams studying ten terms the night before a test, or spends years studying thousands of terms. Moving Forward The Quizlet Learning Assistant Platform paves the way forward for more intelligent and efficient learning on Quizlet. The classic Learn algorithm is simple but not efficient, and the Long-Term Learning algorithm only works well for students without deadlines. By using machine learning to build a predictive model informed by the same cognitive science theories behind spaced repetition, we were able to build an algorithm that makes studying efficient and practical for all our users. We’re excited to launch this as part of the new Learn, and we’re looking forward to continuing to improve it in the future! ",
                articleTitle:
                  "Spaced Repetition for All: Cognitive Science Meets Big Data in a Procrastinating World",
                articleUrl:
                  "https://medium.com/tech-quizlet/spaced-repetition-for-all-cognitive-science-meets-big-data-in-a-procrastinating-world-59e4d2c8ede1",
              },
            ],
          "What are large language models, and how do they work?": [
            {
              type: "youtube",
              title: "What are large language models, and how do they work?",
              question: "What are large language models, and how do they work?",
              start: 24,
              end: 87,
              videoTitle: "[1hr Talk] Intro to Large Language Models",
              summarizedTitle: "An Intro to Large Language Models",
              videoUrl: "https://www.youtube.com/watch?v=zjkBMFhNj_g&t=0",
              videoId: "zjkBMFhNj_g",
              text: "hi everyone so recently I gave a 30-minute talk on large language models just kind of like an intro talk um unfortunately that talk was not recorded but a lot of people came to me after the talk and they told me that uh they really liked the talk so I would just I thought I would just re-record it and basically put it up on YouTube so here we go the busy person's intro to large language models director Scott okay so let's begin first of all what is a large language model really well a large language model is just two files right um there be two files in this hypothetical directory so for example work with the specific example of the Llama 270b model this is a large language model released by meta Ai and this is basically the Llama series of language models the second iteration of it and this is the 70 billion parameter model of uh of this series so there's multiple models uh belonging to the Lama 2 Series uh 7 billion um 13 billion 34 billion and 70 billion is the the biggest one now many people like this model specifically because it is probably today the most powerful open weights model so basically the weights and the architecture and a paper was all released by meta so anyone can work with this model very easily uh by themselves uh this is unlike many other language models that you might be familiar with for example if you're using chat GPT or something like that uh the model architecture was never released it is owned by open aai and you're allowed to",
              cues: [],
            },
            {
              type: "youtube",
              title: "What are large language models, and how do they work?",
              question: "What are large language models, and how do they work?",
              summarizedTitle: "An Intro to Large Language Models",
              start: 36,
              end: 91,
              videoTitle: "MIT CSAIL Explains: Large Language Models: Part 1",
              videoUrl: "https://www.youtube.com/watch?v=xMS1VKyQvjI&t=0",
              videoId: "xMS1VKyQvjI",
              text: "(upbeat ambient music) - Hi, I'm Jacob Andreas, I'm an assistant professor at MIT and ECS and CSAIL and I work on natural language processing. So sort of broadly, my group is interested both in developing better technologies, better machine learning models for working with data from human languages and looking at what we can do with language in support of other kinds of artificial intelligence applications. Doing things like building robots that you can teach using natural language or computer vision systems that can explain their decisions also in language and today I'm gonna be answering your questions about large language models, what are large language models and how do they generate text? When you're typing on your phone and you see that little sort of line that pops up with some guesses about the word that's gonna come next, that's a language model and sort of fundamentally what most of the language models that we work with are just predictive models of text models that have been trained on enormous amounts of text data to look at a sentence or the beginning of a sentence or look at the document in the beginning of a document and just predict what words are likely to come next, how are LLMs large language models trained? Sort of building on that previous answer, the big difference between a large language model that you might have heard of like GPT-3 and the language model that sort of sits there doing predictive text on your phone is really just the scale of the data that it's been trained on and the biggest models that we have right now have really been trained more or less on most of the text on the internet. They're sort of enormous machine learning models with really",
              cues: [],
            },
          ],
        },
    },
  },
};

const truncate = (text: string, length: number) => {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  }
  return text;
};

export default function RecommendationsEmail({
  input = defaults.input,
}: RecommendationsEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Open Recommender Recommendations</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                10: "10px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="font-sans text-base bg-offwhite">
          <Img
            src={`https://open-recommender.com/logo.webp`}
            width="184"
            alt="Open Recommender"
            className="mx-auto my-20 text-center"
          />
          <Container className="bg-white px-45">
            <Heading className="my-20 leading-8 text-center">
              New Recommendations
            </Heading>
            <Section>
              <Row>
                <Text className="text-base text-center">
                  View your latest recommendations below or in your feed.
                </Text>
              </Row>
            </Section>
            <Section className="text-center">
              <Button
                href={`https://open-recommender.com/#/user/${input.username}/feed`}
                className="bg-brand text-white rounded-lg py-3 px-[18px]"
              >
                Go to your feed
              </Button>
            </Section>
            {input.username === "experilearning" && debug && (
              <Section>
                <pre>{JSON.stringify(input, null, 2)}</pre>
              </Section>
            )}

            <Section>
              {
                // Loop through the recommendations and create a section for each query
                Object.entries(input.clips).map(([_, clusters], i) => {
                  return (
                    <Section key={i} style={{ paddingLeft: 10 }}>
                      {
                        // Loop through the clusters and create a section for each question
                        Object.entries(clusters).map(([question, clips], i) => {
                          if (clips.length === 0) return null;
                          return (
                            <div key={i}>
                              <Heading as="h4">{question}</Heading>
                              <ol>
                                {clips.map((clip, i) => {
                                  if (clip.type === "article") {
                                    return (
                                      <li key={i}>
                                        <Link
                                          href={
                                            clip.articleUrl +
                                            "#:~:text=" +
                                            encodeURIComponent(
                                              clip.text
                                                .split(" ")
                                                .slice(0, 5)
                                                .join(" ")
                                            )
                                          }
                                        >
                                          <Text>{clip.articleTitle}</Text>
                                        </Link>
                                        <Text>
                                          "{truncate(clip.text, 450)}"
                                        </Text>
                                      </li>
                                    );
                                  } else {
                                    return (
                                      <li key={i}>
                                        <Link href={clip.videoUrl}>
                                          <Text>
                                            {clip.summarizedTitle} (
                                            {clip.videoTitle})
                                          </Text>
                                        </Link>
                                        <Link href={clip.videoUrl}>
                                          <Text className="text-center">
                                            <Img
                                              width={150}
                                              src={youtubeIdToThumbnailUrl(
                                                clip.videoId
                                              )}
                                            ></Img>
                                          </Text>
                                        </Link>
                                        <Text>
                                          "{truncate(clip.text, 300)}"
                                        </Text>
                                      </li>
                                    );
                                  }
                                })}
                              </ol>
                            </div>
                          );
                        })
                      }
                    </Section>
                  );
                })
              }
            </Section>
            <Container className="mt-20">
              <Section>
                <Row>
                  <Column className="px-20 text-right">
                    <Link href="https://twitter.com/experilearning">
                      Give Feedback
                    </Link>
                  </Column>
                  <Column className="text-left">
                    <Link
                      href={`https://open-recommender.com/#/user/${input.username}/profile`}
                    >
                      Manage Preferences
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
