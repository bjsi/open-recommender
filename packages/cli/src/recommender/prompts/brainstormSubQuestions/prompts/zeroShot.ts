import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { BrainstormQuestionsInput } from "../schemas/brainstormQuestionsInputSchema";
import { BRAINSTORM_QUESTIONS } from "../brainstormQuestions";
import { BrainstormQuestionsOutput } from "../schemas/brainstormQuestionsOutputSchema";

export const brainstormQuestionsZeroShotPrompt =
  new CandidatePrompt<BrainstormQuestionsInput>({
    name: "zero shot",
    compile() {
      return [
        ChatMessage.system(
          `
# Instructions
- You are a teacher creating a powerpoint presentation on a topic.
- Your task is to brainstorm related questions to research.
- If the topic is controversial, try to include both sides of the argument.
- DO NOT USE ACRONYMS OR ABBREVIATIONS, ALWAYS USE THE FULL NAME WITH THE ACRONYM IN PARANTHESES.
- Brainstorm five questions.
`.trim()
        ),
        {
          role: "user",
          content: `
# The Topic
How can Spaced Repetition Systems (SRS) be improved with AI?
`.trim(),
        },
        ChatMessage.assistant<BrainstormQuestionsOutput>(null, {
          name: toCamelCase(BRAINSTORM_QUESTIONS),
          arguments: {
            questions: [
              "What are the current limitations of Spaced Repetition Systems (SRS) for learning?",
              "How has artificial intelligence (AI) been applied to educational systems in other contexts? Can these methods be adapted for Spaced Repetition Systems (SRS)?",
              "What potential improvements could artificial intelligence (AI) bring to Spaced Repetition Systems (SRS) in terms of personalization and effectiveness?",
              "What are the possible risks or drawbacks in integrating artificial intelligence (AI) into Spaced Repetition Systems (SRS)?",
              "How do professionals in the fields of education and artificial intelligence (AI) view the potential integration of artificial intelligence (AI) and Spaced Repetition Systems (SRS)?",
            ],
          },
        }),
        {
          role: "user",
          content: `
# The Topic
${this.getVariable("query")}
`.trim(),
        },
      ];
    },
  });
