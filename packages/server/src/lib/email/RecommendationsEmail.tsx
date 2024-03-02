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

interface RecommendationsEmailProps {
  input: AddRecommendationInput;
}

const defaults: RecommendationsEmailProps = {
  input: {
    username: "experilearning",
    clips: {
      "How to make a website": {
        "How to make a website from scratch": [
          {
            title: "How to make a website from scratch",
            question: "How to make a website from scratch",
            text: "This is a video about how to make a website from scratch",
            articleTitle: "How to make a website from scratch",
            type: "article",
            articleUrl: "https://example.com",
          },
        ],
      },
    },
  },
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
            className="mx-auto my-20"
          />
          <Container className="bg-white px-45">
            <Heading className="my-0 leading-8 text-center">
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
                href={`https://open-recommender.com/#/${input.username}/feed`}
                className="bg-brand text-white rounded-lg py-3 px-[18px]"
              >
                Go to your feed
              </Button>
            </Section>
            {input.username === "experilearning" && (
              <Section>
                <pre>{JSON.stringify(input, null, 2)}</pre>
              </Section>
            )}

            <Section>
              {
                // Loop through the recommendations and create a section for each query
                Object.entries(input.clips).map(([query, clusters], i) => {
                  return (
                    <Section key={i}>
                      <Heading as="h2">{query}</Heading>
                      {
                        // Loop through the clusters and create a section for each question
                        Object.entries(clusters).map(([question, clips], i) => {
                          return (
                            <React.Fragment key={i}>
                              <Heading as="h4">{question}</Heading>
                              {clips.map((clip) => {
                                return (
                                  <Row>
                                    <Text>{clip.text}</Text>
                                  </Row>
                                );
                              })}
                            </React.Fragment>
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
                    <Link>Give Feedback</Link>
                  </Column>
                  <Column className="text-left">
                    <Link>Manage Preferences</Link>
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
