import { Prompt } from "prompt-iteration-assistant";
import { titleClipPrompt } from "./prompts/titleClipPrompt";
import { titleClipInputSchema } from "./schemas/titleClipInputSchema";
import { titleClipOutputSchema } from "./schemas/titleClipOutputSchema";

export const TITLE_CLIP = "Title Clip";

export const titleClip = () =>
  new Prompt({
    name: TITLE_CLIP,
    description: "Give the clip a short title",
    prompts: [titleClipPrompt],
    model: "gpt-3.5-turbo",
    input: titleClipInputSchema,
    output: titleClipOutputSchema,
  });

if (require.main === module) {
  (async () => {
    // const res = await answersQuestion().run({
    //   stream: false,
    // //   promptVariables: {
    // //     text: "",
    // //     question: "How does chain of thought prompting work",
    // //   },
    // });
    // console.log(res);
  })();
}
