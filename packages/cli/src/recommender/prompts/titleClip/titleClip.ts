import { Prompt } from "prompt-iteration-assistant";
import { titleClipPrompt } from "./prompts/titleClipPrompt";
import {
  TitleClipInput,
  titleClipInputSchema,
} from "./schemas/titleClipInputSchema";
import { titleClipOutputSchema } from "./schemas/titleClipOutputSchema";

export const TITLE_CLIP = "Title Clip";

class TitleClip extends Prompt<
  typeof titleClipInputSchema,
  typeof titleClipOutputSchema
> {
  constructor() {
    super({
      name: TITLE_CLIP,
      description: "Give the clip a short title",
      prompts: [titleClipPrompt],
      model: "gpt-3.5-turbo",
      input: titleClipInputSchema,
      output: titleClipOutputSchema,
    });
  }

  async execute(args: TitleClipInput) {
    try {
      return this.run({
        stream: false,
        promptVariables: args,
      });
    } catch (e) {
      console.error(e);
      return { title: "" };
    }
  }
}

export const titleClip = () => new TitleClip();
