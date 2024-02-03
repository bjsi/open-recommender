import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { GetTopicFromQuestionInput } from "../schemas/getTopicFromQuestionInputSchema";
import { GetTopicFromQuestionOutput } from "../schemas/getTopicFromQuestionOutputSchema";
import { GET_TOPIC_FROM_QUESTION } from "../getTopicFromQuestion";

export const getTopicFromQuestionZeroShotPrompt =
  new CandidatePrompt<GetTopicFromQuestionInput>({
    name: "zero shot",
    compile() {
      return [
        ChatMessage.system(
          `
# Instructions
- Given a question from the user, extract the main topic and output a query.
`.trim()
        ),
        ChatMessage.user(
          `
# Question
What is the best way to learn a new language?
`.trim()
        ),
        ChatMessage.assistant<GetTopicFromQuestionOutput>(null, {
          name: toCamelCase(GET_TOPIC_FROM_QUESTION),
          arguments: {
            query: "Best way to learn a new language",
          },
        }),
        ChatMessage.user(
          `
# Question
How does chain of thought prompting work?
`.trim()
        ),
        ChatMessage.assistant<GetTopicFromQuestionOutput>(null, {
          name: toCamelCase(GET_TOPIC_FROM_QUESTION),
          arguments: {
            query: "Chain of thought prompting",
          },
        }),
        ChatMessage.user(
          `
# Question
${this.getVariable("question")}
`.trim()
        ),
      ];
    },
  });
