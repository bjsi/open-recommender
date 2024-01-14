import { Prompt } from "prompt-iteration-assistant";
import {
  CreateQueriesFromProfileInput,
  createQueriesFromProfileInputSchema,
} from "./schemas/createQueriesFromProfileInputSchema";
import { createQueriesFromProfileOutputSchema } from "./schemas/createQueriesFromProfileOutputSchema";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { openpipe } from "../../../openpipe/openpipe";
import { experilearningDataset } from "./datasets/experilearningDataset";
import { createQueriesFromProfileZeroShotFreeFormPrompt } from "./prompts/zeroShotFreeForm";

export const CREATE_SEARCH_QUERIES_FROM_PROFILE =
  "Create Search Queries From Profile";

/**
 * We use GPT to create YouTube search queries based on the user's profile.
 * Getting this prompt right is critical to the success of the recommender.
 */
export class CreateSearchQueriesFromProfile extends Prompt<
  typeof createQueriesFromProfileInputSchema,
  typeof createQueriesFromProfileOutputSchema
> {
  constructor() {
    super({
      name: CREATE_SEARCH_QUERIES_FROM_PROFILE,
      description:
        "Create YouTube video search queries based on the user's profile.",
      prompts: [createQueriesFromProfileZeroShotFreeFormPrompt],
      model: "gpt-4",
      input: createQueriesFromProfileInputSchema,
      output: createQueriesFromProfileOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: string;
    profile: string;
    bio: string;
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: CreateQueriesFromProfileInput = {
      user: args.user,
      bio: args.bio,
      profile: args.profile,
    };
    const candidatePrompt = this.chooseCandidatePrompt(promptVariables);
    const res = await openpipe.functionCall({
      function: {
        name: this.name,
        description: this.description,
        input: this.input!,
        output: this.output!,
      },
      vars: promptVariables,
      prompt: candidatePrompt,
      body: {
        max_tokens: this.max_tokens,
        temperature: this.temperature,
        model: this.model,
        stream: false,
      },
      openPipeRequestTags: args.openPipeRequestTags
        ? {
            ...args.openPipeRequestTags,
            promptName: formatPromptName(this.name, candidatePrompt.name),
          }
        : undefined,
      enableOpenPipeLogging: args.enableOpenPipeLogging,
    });
    return res || { queries: [] };
  }
}

export const createQueriesFromProfile = () =>
  new CreateSearchQueriesFromProfile().withTest({
    name: "experilearning",
    vars: {
      user: experilearningDataset.user.value,
      bio: experilearningDataset.bio.value,
      profile: experilearningDataset.profile.value,
    },
  });

if (require.main === module) {
  (async () => {
    const res = await createQueriesFromProfile().execute({
      user: experilearningDataset.user.value,
      bio: experilearningDataset.bio.value,
      profile: `@experilearning's tweets reveal a deep interest and engagement in different aspects of learning algorithms and machine learning methodologies, notably LLM agents and Spaced Repetition Systems (SRS). This is reflected in articles shared about transitioning from SRS to open recommender systems and envisioning the resurgence of RSS reader style consumption once LLM costs drop. Open source AI projects and platforms like OpenPipeAI are also of importance. Experilearning demonstrates an understanding of the impact of engaging content and the competition for attention in increasing the difficulty level in the learning process. An interest in incorporating aspects of social media feed into learning systems is noticeable. Experilearning has an affinity for podcasts such as The Joe Walker Podcast, Dwarkesh podcast, and Conversations with Tyler. Engagement with tweets from users such as @zdrks, @nashwinio, @lgrammel, and @pmarca implies interests that range across influential perspectives on talent constraint, open source AI policy debates, the impact of technology in shaping our world, and learning strategies. From the Twitter data of the user, experilearning, it can be observed that they have a deep interest in language models and recommender systems related to the former. They've been experimenting with Latent Language Models (LLMs) in creating recommender systems, mentioning their creation of an open-source, LLM-powered recommendation system that uses Twitter as an input to recommend YouTube videos. The user also has shown a clear interest in the technical aspect of these systems, talking about debugging, pipeline abstraction, and memoize function to improve the recommender system. They've posted about creating a Youtube video recommender system, detailed their plan about using metadata to find 'timeless' content, and can infer the user's current interests. They've been digging into data pipelines, checkpoint systems, and implementing getUserContext from Twitter. They're proactive about advancing their model, even writing articles to share their insights and progress, such as how Spaced Repetition Systems can learn from modern recommender systems. - @experilearning is heavily involved with language models (LLMs) and their applications, specifically in the areas of open recommendation systems and spaced repetition systems (SRS). They express interests in the use of LLMs in open recommender systems that can be used for pre-filtering web contents, blurring the lines between learning and entertainment. Active on GitHub, they are not just consumers but contribute to open source projects: a recommender system project 'open-recommender'. They engage deeply in AI related discussions, especially revolving around GPT-3.5 instruct protocol and how its responses differ with the changing language cues. They seem to be an avid follower of the science fiction genre, particularly interested in how The Three Body Problem narrates the consequences of delaying technological development. Social interactions and network growth are also in their areas of interest, as evidenced by their discussion regarding keeping track of social rejections and acceptances. They also follow developments in AI-related government policies critically, expressing skepticism regarding AI's role in solving actual problems in the public sector. All this paints a picture of an enthusiast deeply embedded in advanced AI applications, open-source culture, and adopting a quantitative approach to personal development. experilearning is deeply invested in AI development, particularly language models (LMs). They experiment with creating an AI journaling assistant, fine-tuning the retrieval augmented generation model (RAG) for enhanced memory. They have also considered local LLM applications to save the costs and time associated with GPT-4 calls. experilearning engages with fellow developers such as @RobertHaisfield, @benparr, and @degtrdg, exploring topics like information retrieval, efficient usage of expensive LM resources, and patient-procedure matching in medical applications. The user frequently interacts with and comments on recent developments in the tech sector, engaging in pragmatic discussions on the workings and implications of tools such as Markdown, selenium code for web scraping, and LLM's response quality. Their interplay with various tech pioneers may also suggest a vested interest in AI performances and optimization, with specific note to context selection and the making of flashcard apps analogous to modern recommender systems. @experilearning is an AI enthusiast focused on innovations related to LLM agents. He develops a SRS app at Remnote and explores the use of AI in generating APIs not present in the training set. His work on the BakLLaVA-1 app suggests his interest in real-time feedback systems in fields like gym training. Specific interest is also noticed towards leveraging AI in development of chatbots for YouTube channels using OpenAI key. The user, @experilearning, seems particularly interested in the intersection of artificial intelligence (AI) and daily life tasks, focusing on concepts of Lifelong Learning Machines (LLMs) and Spaced Repetition Systems (SRS). In specific projects, they've examined how AI can aid in meal preparation and grocery shopping with a development project named 'AI open source Hello Fresh'. They've also explored concepts of user-friendly review systems in SRS applications, drawing insights from modern recommender systems to enhance user engagement, akin to the binge-worthy nature of YouTube shorts. Lastly, the user is greatly concerned about the legal environment for tech startups in the EU. They share a tweet criticizing the EU's approach towards tech innovation. In terms of technical application focus, this user shows an avid interest in innovative use of machine learning and programming in digital education. They have exhibited this interest through the development of the SRS app 'Rem Note', and their use of programming tools such as yt-dlp to scrape YouTube metadata. @experilearning is a technologist with a specific interest in Language Learning Models (LLMs), artificial intelligence, and agent architecture. They specialize in developing AI systems for real-world applications such as developing an AI-driven open-source Hello Fresh prototype, building Remnote - an SRS app aimed at efficient learning, maintaining active discussions on AI safety, and looking for ways to enhance workflow efficiency, like generating selenium code for web scraping with the help of a General Purpose Transformer (GPT). They are also heavily involved in scientific and academic discussions, referencing works from Henri Poincaré and applying these concepts to technology and AI. The user's focus extends to advanced AI applications like GitHub Copilot and OpenAI's gpt-3.5-turbo-instruct, and they often engage with contributors to the field like Daniel Gross and Ludwig Grammel. Lastly, they seem keen on exploring novel methodologies for problem-solving through agent testing libraries and experimenting with various prompt styles like Chain of Thought (CoT) and Tree of Thought (GoT). @experilearning is a developer and an enthusiastic learner who shows a great interest in the evolution and application of AI, particularly Language Models (LLMs). Their work demonstrates significant focus on the development of tools or plugins that automate processes and increase efficiency, highlighted through their ongoing project for a TypeScript type error fixer (ts-type-fixer). They spent considerable time designing and deploying various LLMs strategies to manage complex TypeErrors, testing them within large codebases, and are into improving these systems for better context understanding and error handling. @experilearning is also deeply involved in the study and improvement of Spaced Repetition Systems (SRS). They explore how to make learning processes enjoyable and productive, comparing flashcard apps to recommender systems, and pondering ways to make learning as engaging as entertainment platforms like YouTube shorts. They've been developing comprehensive SRS strategies within the rem_note application, expanding their functionality in innovative and unique ways. They appreciate collaborative work and thinkers like Jarrett and Andy Matuschak that challenge the traditional learning strategies and metaphors. They seek out resources on chain of thought / simulated debate + chain of though prompt styles. @experilearning also showed an interest in flashcard crafting, guitar lessons, and incremental reading and writing. Lastly, they also published a math series using flashcards and an interactive theorem prover (Lean), indicating an interest in math and education tool development. @experilearning is a tech enthusiast invested in the development of Spaced Repetition Systems (SRS) and Learning Latent Manifold (LLM) agents. They work with @rem_note, where they contribute plugins, develop exercise templates, and enable programming languages such as Lean. They're deeply involved with making SRS more engaging by integrating ideas from modern recommender systems. They have an interest in math education, providing resources such as flashcards and interactive theorem prover content via their RemNote profile. They engage with other developers and learning enthusiasts, sharing insights, gathering feedback, and contributing to projects related to AI, SRS, and coding education. They also seem to have a preference for digital tools that facilitate better comprehension, evidenced by their promotion of GitHub Copilot alternatives and endorsements of noteworthy tech profiles such as @ErikBjare, @MelMitchell1, and @GeorgeHotz. experilearning demonstrates a keen interest in utilizing advanced methods and tools for effective learning, particularly in the realm of mathematics. Their engagement with tools such as RemNote and Lean gives a clear indication of their pursuit to optimally learn and impart knowledge. They show enthusiasm towards FSRS4RemNote, which represents their inclination towards integrating innovative tech solutions in their learning process. Furthermore, they demonstrate an inclination towards creating educational content, as evidenced by their commitment to creating comprehensive articles and videos.  experilearning acknowledges the perspectives of other key individuals in the learning domain, showing a willingness to integrate feedback and explore new ideas in their approach. This is evident in their conversation with users like @Wrath0fLog1c and @iulspop, signifying their open mindset towards collaboration. A mention of their website 'experimental-learning' suggests experilearning's endeavor to create an engaging learning platform. Despite facing technical difficulties, they express a determination to keep their platform up and running, reflecting their resolute dedication to their project. Similarly, their interaction with @dashelllaryea portrays their penchant for creative content development, albeit acknowledging the limitations posed by changes in API and upgraded plugins.`,
    });
    console.log(res);
  })();
}
