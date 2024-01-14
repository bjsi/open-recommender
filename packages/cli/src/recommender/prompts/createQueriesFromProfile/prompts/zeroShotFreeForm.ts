import { CandidatePrompt, ChatMessage } from "prompt-iteration-assistant";
import { sharedCreateQueriesInstructions } from "./shared";
import { CreateQueriesFromProfileInput } from "../schemas/createQueriesFromProfileInputSchema";

export const createQueriesFromProfileZeroShotFreeFormPrompt =
  new CandidatePrompt<CreateQueriesFromProfileInput>({
    name: "zero shot free form-2",
    compile() {
      return [
        ChatMessage.system(sharedCreateQueriesInstructions({ short: false })),
        {
          role: "user",
          content: `
# My Twitter Username
${this.getVariable("user")}

# My Twitter Bio
${this.getVariable("bio")}

# My Profile
${this.getVariable("profile")}
`.trim(),
        },
      ];
    },
  });
