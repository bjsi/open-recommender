import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { CreateQueriesFromProfileInput } from "../schemas/createQueriesFromProfileInputSchema";

export const createQueriesFromProfileZeroShotFreeFormPrompt =
  new CandidatePrompt<CreateQueriesFromProfileInput>({
    name: "zero shot free form-2",
    compile() {
      return [
        ChatMessage.system(
          `
# Instructions
- Based on your persona, write 10 research questions you would be interested in investigating based on ideas, concepts, problems, people and events that interest you.
- Don't include introductory or background questions.
- Make sure the questions are interesting. Don't ask questions you likely know the answer to based on your persona.
- Don't ask duplicate questions.
`.trim()
        ),
        {
          role: "user",
          content: `
# Your Persona

## Your Username
${this.getVariable("user")}

## Your Bio
${this.getVariable("bio")}

## Your Profile
${this.getVariable("profile")}
`.trim(),
        },
      ];
    },
  });
