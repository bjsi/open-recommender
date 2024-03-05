import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { AnswersQuestionInput } from "../schemas/answersQuestionInputSchema";
import { ANSWERS_QUESTION } from "../answersQuestion";
import { AnswersQuestionOutput } from "../schemas/answersQuestionOutputSchema";

export const answersQuestionPrompt = new CandidatePrompt<AnswersQuestionInput>({
  name: "main",
  compile() {
    return [
      ChatMessage.system(
        `
# Instructions
- Given a question from the user, evaluate whether the text is relevant to the question.
- If the the text is relevant to the question, return true.
- If the text is not relevant to the question, return false.
`.trim()
      ),
      ChatMessage.user(
        `
# Question
What are the potential benefits and drawbacks of integrating Large Language Models into Spaced Repetition Systems for modern education?

# Text
first i wanted to get into why this technique is so powerful and also talk to you a little bit about the history behind it and how it relates to our memories in general space repetition leverages a memory phenomenon known as the spacing effect which describes how our brains make better connections and overall remember things more effectively when we space out our learning over time here's how pierce j howard the author of my least favorite book to haul into coffee shops puts it work involving higher mental functions such as analysis and synthesis needs to be spaced out in order to allow new neural connections to solidify
`.trim()
      ),
      ChatMessage.assistant<AnswersQuestionOutput>(
        "The text is related but does not mention large language models.",
        {
          name: toCamelCase(ANSWERS_QUESTION),
          arguments: {
            answersQuestion: false,
          },
        }
      ),
      ChatMessage.user(
        `
# Question
What are the potential benefits and drawbacks of integrating Large Language Models into Spaced Repetition Systems for modern education?

# Text
As a society and as educational institutions, we have a responsibility to provide support in this endeavor. It is essential to recognize that the solution lies not solely in technological advancements but in transforming how we teach students to utilize these tools. One key challenge is that many students have become accustomed to a passive learning approach, simply listening to what the teacher imparts. However, to harness the full potential of AI tools, students must adopt an active stance and actively control their interaction with AI tutors.
`.trim()
      ),
      ChatMessage.assistant<AnswersQuestionOutput>(
        "The text is related, mentioning both AI tutors which use largue language models and spaced repetition.",
        {
          name: toCamelCase(ANSWERS_QUESTION),
          arguments: {
            answersQuestion: true,
          },
        }
      ),
      ChatMessage.user(
        `
# Question
${this.getVariable("question")}

# Text
${this.getVariable("text")}
`.trim()
      ),
    ];
  },
});
