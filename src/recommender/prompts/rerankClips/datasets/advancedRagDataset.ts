import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { rerankClipsInputSchema } from "../schemas/rerankClipsInputSchema";
import { TranscriptClip } from "../../recommendClips/helpers/transcriptClip";
import { transcriptClipsToString } from "../helpers/transcriptClipsToString";

const clips: TranscriptClip[] = [
  {
    start: 32,
    end: 186,
    videoId: "videoId",
    videoUrl: "videoUrl",
    videoTitle: "Advanced RAG 01",
    title: "Advanced RAG: Self Querying Retrieval and Metadata",
    summary:
      "Given your interest in AI journalling and your work with RAG/chat memory, this clip provides valuable insights into advanced RAG systems, self querying retrieval, and the use of metadata, which aligns with your exploration of AI and metadata in your tweets.",
    text:
      `So this brings us to the whole concept of self querying retrieval. ` +
      `If we look at the diagram for this, we can see that the idea here is that. ` +
      `We have a sort of step between the retrieval and the input. ` +
      `So the person types in their query. ` +
      `and then we use a large language model to reformat that query to get ` +
      `both the semantic elements of that, but also to be able to convert it ` +
      `so that we can actually do searches on metadata as we go through this. ` +
      `So this is a fundamental fact that if you're looking for a movie and you ` +
      `want to basically specify the year, you don't want to look for the year using ` +
      `a vector store in semantic search. ` +
      `You want to basically just do a lookup that looks at the year and ` +
      `filters the results back based on that year that you put in. ` +
      `Just the same if you were doing something for doing searches on Spotify or doing ` +
      `such as with music, if the person gives you the name of the artist, ` +
      `you don't want to use semantic search to look up the name of the artist. ` +
      `You want to do a query that looks for that artists and then uses the semantic ` +
      `search for doing the parts where semantic search is actually strong in this. ` +
      `So let's jump in, have a look at this in LangChain. ` +
      `So we're going to be using the self querying retriever here. ` +
      `now I'm using OpenAI embeddings and the OpenAI models. ` +
      `you can swap out, these for, you know, the other models like ` +
      `I've done in many videos before. ` +
      `And maybe at some point I'll do an end-to-end example of building an app with ` +
      `this using LLaMA-2 and say BGE embeddings. ` +
      `I've just gone for these cause so that these parts are not ` +
      `the important part in here. ` +
      `And the code doesn't take up too much room. ` +
      `So I'm using chroma as my vector store in here. ` +
      `like I said, I'm using the OpenAI embeddings. ` +
      `and then I'm going to pass in data. ` +
      `So this is where you would put a lot of effort into preparing your data. ` +
      `In this case, I'm going to be doing search over wines. ` +
      `And wine's going to have a number of different things in here. ` +
      `So you can see that we've got a description of the wine that's in here. ` +
      `We've got the name of the wine. ` +
      `We've got the year. ` +
      `We've got the rating that it's got. ` +
      `We've got the type of, grape, in there. ` +
      `We've also got the color of the wine. ` +
      `And finally, we've got the country of where the wine comes from. ` +
      `So all of these things are metadata that we're putting in, ` +
      `And he, you can see that I've got these for a number of different wines in here. ` +
      `Now, Which part where we use the semantic search on? ` +
      `We would use it on this description that we've got here. ` +
      `So the description is what's going to be actually used for doing the search. ` +
      `So you'll see, as we go through it, that if we talk about things ` +
      `like, fruity notes or that kind of thing, It's able to work out that, ` +
      `okay, apricot and peaches are fruit. ` +
      `black fruit, stone fruits. ` +
      `These are sorts of things that relate to fruit, citrus flavors. `,
  },
  {
    start: 200,
    end: 280,
    videoId: "videoId",
    videoUrl: "videoUrl",
    videoTitle: "Advanced RAG 01",
    title: "Advanced RAG: Embedding and Metadata Info",
    summary:
      "This clip discusses the process of embedding and setting up metadata info in RAG systems, which could be useful for your AI journalling project as you mentioned the importance of metadata in your tweets.",
    text:
      `So we've got our data in here and you could spend quite a bit of time going ` +
      `through and, working out the best metadata for your particular use case one of the ` +
      `things that I see a lot of people, you know, if they've got a CSV file and a ` +
      `lot of the data would make good metadata. ` +
      `And then part of it would be used for the semantic search. ` +
      `This is a perfect example that you could do this. ` +
      `And you could basically write a little function that would go through ` +
      `your CSV file, take it out and convert it to something like this ` +
      `for all your different examples. ` +
      `All right. ` +
      `once we've got these, we basically need to embed them and ` +
      `put them into our vector store. ` +
      `So this is what the last line here is doing. ` +
      `It's just making a chroma DB from documents. ` +
      `We're passing in these documents. ` +
      `We're passing in what to use to do the embeddings. ` +
      `And it's going to embed these part and it's going to keep the ` +
      `metadata separate for these. ` +
      `All right. ` +
      `So next step, what we need to do is create our self querying retriever here. ` +
      `So this is something that's built into LangChain. ` +
      `the key thing that we need to do though, is we need to tell it the metadata info. ` +
      `So you see that each one of these relates to one of the types of ` +
      `metadata that we've got in there. ` +
      `So we've got grape, which is the great use to make the wine. ` +
      `we've got the name of the wine and you'll see that these are ` +
      `strings or list of string in here. ` +
      `we've got the year is going to be an integer. ` +
      `we've got the country here, we've got the color of the wine. ` +
      `We've got the rating. ` +
      `Now the rating in this case is an integer, but if you were using something like, you ` +
      `know, score out of five and you could have 3.7 out of five, then you would change ` +
      `that to be a float for this kind of thing. ` +
      `And so the model that we're using actually knows what a Robert Parker rating is. ` +
      `So this is a famous wine reviewer and the ratings that we've got there, ` +
      `based on that kind of rating in there. ` +
      `I'm not sure if they're totally accurate, but it gives you a sort of sense of this. ` +
      `country, obviously that's going to be a string. ` +
      `and then for the semantic bit, this is going to be a brief description ` +
      `of the wine that we've got there. ` +
      `So once we've got that, we then basically set up out our large language model. ` +
      `Again, in this case, we're just using the OpenAI model. `,
  },
  {
    start: 320,
    end: 410,
    videoId: "videoId",
    videoUrl: "videoUrl",
    videoTitle: "Advanced RAG 01",
    title: "Advanced RAG: Querying and Filtering",
    summary:
      "This clip discusses querying and filtering in advanced RAG systems, which could be beneficial for your AI journalling project as it aligns with your interest in improving RAG/chat memory.",
    text:
      `are we going to pass in the LLM? ` +
      `The vector store? ` +
      `All of this is very similar to just normal retrieval, augmented ` +
      `generation with LangChain. ` +
      `the next things we want to pass in is okay. ` +
      `What do we actually do the query on, and also the Meta data fields info in here. ` +
      `So these are the sort of two differences that we would do from a normal rag system. ` +
      `Now you'll see that we can go through and we can query. ` +
      `and what actually happens is that the model will take our input, ` +
      `which in this case, is the, what, you know, what are some red wines? ` +
      `And it will write a query. ` +
      `Now, in this case, there's nothing semantic going on in the query, right. ` +
      `It's just purely going to be filtering, but the filter ` +
      `is going to be a comparison. ` +
      `and it's going to be a quality comparison. ` +
      `We see that we can see that attribute is going to be color. ` +
      `The value is going to be red. ` +
      `So sure enough, if we look at what gets returned back, we ` +
      `can see that we've got back. ` +
      `these nice results here of where we've got, an Italian red wine. ` +
      `We can see the, you know, for this color, red color, red color, red color red. ` +
      `So we've got a variety of different ones there. ` +
      `If we want to do some sort of semantic search now where I'm saying, okay, ` +
      `I want a wine that has fruity nodes. ` +
      `and, it's going to basically now do the search and I can see, okay, this ` +
      `wine has a crisp white, tropical fruit and citrus flavors, right. ` +
      `Which fits out our description. ` +
      `You can see that we get back all the metadata as well. ` +
      `we've got another one where this has got dark fruit flavors. ` +
      `Again, that fits the fruity nodes in here. ` +
      `so we can do a variety of different searches. ` +
      `What if I say, okay, I want a wine that has fruity nodes and ` +
      `a rating above 97 in this case. ` +
      `so here it's got our comparitor where I've got my greater than at rating, 97. ` +
      `and it's bringing things back that again, relate to fruit. ` +
      `So apricot and peach red fruit, earthy notes there. ` +
      `What if I say, I want wines from Italy. ` +
      `So now this is no query on this. ` +
      `You can see here, the query up there for that last one was fruity. ` +
      `Right? ` +
      `we can see that this one has no semantic query, but it has ` +
      `an equality country, Italy. ` +
      `We get the Italian red ones back. ` +
      `what if we want to do a composite of a few things? ` +
      `So here I could say, okay, I want a wine that's going to be that's all earthy. ` +
      `and it's going to be between 2015 and 2020. ` +
      `and sure enough, you can see that it's worked out that the, The semantic ` +
      `element to look up is earthy in here. ` +
      `And then here, we've got an operator of and, and we've got this comparison ` +
      `of, greater than year 2015 and greater than a year, less than 2020 in here. ` +
      `And it's able then to basically bring back the data that we want. ` +
      `So this shows us that we can do a Whole variety of different searches ` +
      `that comprise both filtering the metadata, but also using the semantic.`,
  },
];

export const advancedRagDataset: ExampleDataSet<typeof rerankClipsInputSchema> =
  {
    clips: {
      name: "advanced rag clips",
      value: transcriptClipsToString(clips),
    },
    tweets: {
      name: "advanced rag tweets",
      value: `
ID: 91
tweet: @experilearning (2023-11-07)
Experimenting with creating a AI journalling assistant rn. Getting the RAG/chat memory right is the most important part. Here's the approach that got the best results so far:
- take each paragraph
- add metadata using gpt (emotions mentioned, people mentioned, topics mentioned)
- for each theme (emotion/topic/person) take all paragraphs mentioning that theme and summarise using GPT
- when writing a new journal entry, extract themes (emotions/topics/people), then include all the summaries for those themes and get the AI to question you
It feels way better than naive RAG. Obviously it's more work, more expensive and you end up having to keep doing LLM calls to update the summaries over time, but I think it's worth it.
reply: @experilearning (2023-11-13)
Exporting and pre-processing to get RAG working is extremely tedious. My journals are messy hierarchies of markdown bullets of varying lengths with topics spread all over the page. I threw GPT-4 at the problem and rewrote, chunked, and attached metadata for all of the journals 🤷‍♂️
---
ID: 92
@experilearning (2023-11-07)
Experimenting with creating a AI journalling assistant rn. Getting the RAG/chat memory right is the most important part. Here's the approach that got the best results so far:
- take each paragraph
- add metadata using gpt (emotions mentioned, people mentioned, topics mentioned)
- for each theme (emotion/topic/person) take all paragraphs mentioning that theme and summarise using GPT
- when writing a new journal entry, extract themes (emotions/topics/people), then include all the summaries for those themes and get the AI to question you
It feels way better than naive RAG. Obviously it's more work, more expensive and you end up having to keep doing LLM calls to update the summaries over time, but I think it's worth it.
`.trim(),
    },
  };
