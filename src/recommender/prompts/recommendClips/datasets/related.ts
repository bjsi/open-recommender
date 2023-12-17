import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { recommendClipsInputSchema } from "../schemas/recommendClipsInputSchema";

export const relatedDataset: ExampleDataSet<typeof recommendClipsInputSchema> =
  {
    title: {
      name: "lex-pod",
      value: "Advanced RAG 01",
    },
    tweets: {
      name: "ai-therapist-tweets",
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
`,
    },
    transcript: {
      name: "advanced-rag",
      value: `
ID: 0
Okay.
---
ID: 1
So in this video, I'm going to address one of the biggest issues that I
---
ID: 2
see people having problems with in relation to building RAG systems or
---
ID: 3
retrieval augmented generation systems.
---
ID: 4
and that is that they try to use semantic search for everything.
---
ID: 5
you only want to use semantic search where it makes sense to use semantic search.
---
ID: 6
If you're doing search on things that would be the kind of things
---
ID: 7
that are in a normal database that you would just look up an integer,
---
ID: 8
look up a string, that kind of thing.
---
ID: 9
You actually don't want to use those for doing semantic search.
---
ID: 10
You want to do semantic search where you've got text that you're trying to
---
ID: 11
extract semantic, meaning out of that.
---
ID: 12
So this brings us to the whole concept of self querying retrieval.
---
ID: 13
if we look at the diagram for this, we can see that the idea here is that.
---
ID: 14
We have a sort of step between the retrieval and the input.
---
ID: 15
So the person types in their query.
---
ID: 16
and then we use a large language model to reformat that query to get
---
ID: 17
both the semantic elements of that, but also to be able to convert it
---
ID: 18
so that we can actually do searches on metadata as we go through this.
---
ID: 19
So this is a fundamental fact that if you're looking for a movie and you
---
ID: 20
want to basically specify the year, you don't want to look for the year using
---
ID: 21
a vector store in semantic search.
---
ID: 22
You want to basically just do a lookup that looks at the year and
---
ID: 23
filters the results back based on that year that you put in.
---
ID: 24
Just the same if you were doing something for doing searches on Spotify or doing
---
ID: 25
such as with music, if the person gives you the name of the artist,
---
ID: 26
you don't want to use semantic search to look up the name of the artist.
---
ID: 27
You want to do a query that looks for that artists and then uses the semantic
---
ID: 28
search for doing the parts where semantic search is actually strong in this.
---
ID: 29
So let's jump in, have a look at this in LangChain.
---
ID: 30
So we're going to be using the self querying retriever here.
---
ID: 31
now I'm using OpenAI embeddings and the OpenAI models.
---
ID: 32
you can swap out, these for, you know, the other models like
---
ID: 33
I've done in many videos before.
---
ID: 34
And maybe at some point I'll do an end-to-end example of building an app with
---
ID: 35
this using LLaMA-2 and say BGE embeddings.
---
ID: 36
I've just gone for these cause so that these parts are not
---
ID: 37
the important part in here.
---
ID: 38
And the code doesn't take up too much room.
---
ID: 39
So I'm using chroma as my vector store in here.
---
ID: 40
like I said, I'm using the OpenAI embeddings.
---
ID: 41
and then I'm going to pass in data.
---
ID: 42
So this is where you would put a lot of effort into preparing your data.
---
ID: 43
In this case, I'm going to be doing search over wines.
---
ID: 44
And wine's going to have a number of different things in here.
---
ID: 45
So you can see that we've got a description of the wine that's in here.
---
ID: 46
We've got the name of the wine.
---
ID: 47
We've got the year.
---
ID: 48
We've got the rating that it's got.
---
ID: 49
We've got the type of, grape, in there.
---
ID: 50
We've also got the color of the wine.
---
ID: 51
And finally, we've got the country of where the wine comes from.
---
ID: 52
So all of these things are metadata that we're putting in,
---
ID: 53
And he, you can see that I've got these for a number of different wines in here.
---
ID: 54
Now, Which part where we use the semantic search on?
---
ID: 55
We would use it on this description that we've got here.
---
ID: 56
So the description is what's going to be actually used for doing the search.
---
ID: 57
So you'll see, as we go through it, that if we talk about things
---
ID: 58
like, fruity notes or that kind of thing, It's able to work out that,
---
ID: 59
okay, apricot and peaches are fruit.
---
ID: 60
black fruit, stone fruits.
---
ID: 61
These are sorts of things that relate to fruit, citrus flavors.
---
ID: 62
but if we're talking about a year, we don't want it to just
---
ID: 63
do semantic search over that.
---
ID: 64
We want it to use a specific year and filter by that year.
---
ID: 65
So we've got our data in here and you could spend quite a bit of time going
---
ID: 66
through and, working out the best metadata for your particular use case one of the
---
ID: 67
things that I see a lot of people, you know, if they've got a CSV file and a
---
ID: 68
lot of the data would make good metadata.
---
ID: 69
And then part of it would be used for the semantic search.
---
ID: 70
This is a perfect example that you could do this.
---
ID: 71
And you could basically write a little function that would go through
---
ID: 72
your CSV file, take it out and convert it to something like this
---
ID: 73
for all your different examples.
---
ID: 74
All right.
---
ID: 75
once we've got these, we basically need to embed them and
---
ID: 76
put them into our vector store.
---
ID: 77
So this is what the last line here is doing.
---
ID: 78
It's just making a chroma DB from documents.
---
ID: 79
We're passing in these documents.
---
ID: 80
We're passing in what to use to do the embeddings.
---
ID: 81
And it's going to embed these part and it's going to keep the
---
ID: 82
metadata separate for these.
---
ID: 83
All right.
---
ID: 84
So next step, what we need to do is create our self querying retriever here.
---
ID: 85
So this is something that's built into LangChain.
---
ID: 86
the key thing that we need to do though, is we need to tell it the metadata info.
---
ID: 87
So you see that each one of these relates to one of the types of
---
ID: 88
metadata that we've got in there.
---
ID: 89
So we've got grape, which is the great use to make the wine.
---
ID: 90
we've got the name of the wine and you'll see that these are
---
ID: 91
strings or list of string in here.
---
ID: 92
we've got the year is going to be an integer.
---
ID: 93
we've got the country here, we've got the color of the wine.
---
ID: 94
We've got the rating.
---
ID: 95
Now the rating in this case is an integer, but if you were using something like, you
---
ID: 96
know, score out of five and you could have 3.7 out of five, then you would change
---
ID: 97
that to be a float for this kind of thing.
---
ID: 98
And so the model that we're using actually knows what a Robert Parker rating is.
---
ID: 99
So this is a famous wine reviewer and the ratings that we've got there,
---
ID: 100
based on that kind of rating in there.
---
ID: 101
I'm not sure if they're totally accurate, but it gives you a sort of sense of this.
---
ID: 102
country, obviously that's going to be a string.
---
ID: 103
and then for the semantic bit, this is going to be a brief description
---
ID: 104
of the wine that we've got there.
---
ID: 105
So once we've got that, we then basically set up out our large language model.
---
ID: 106
Again, in this case, we're just using the OpenAI model.
---
ID: 107
But you could use a LLaMA-2, you could use, you know, a variety of
---
ID: 108
different ones that you want here.
---
ID: 109
Right then we basically set up our retriever.
---
ID: 110
are we going to pass in the LLM?
---
ID: 111
The vector store?
---
ID: 112
All of this is very similar to just normal retrieval, augmented
---
ID: 113
generation with LangChain.
---
ID: 114
the next things we want to pass in is okay.
---
ID: 115
What do we actually do the query on, and also the Meta data fields info in here.
---
ID: 116
So these are the sort of two differences that we would do from a normal rag system.
---
ID: 117
Now you'll see that we can go through and we can query.
---
ID: 118
and what actually happens is that the model will take our input,
---
ID: 119
which in this case, is the, what, you know, what are some red wines?
---
ID: 120
And it will write a query.
---
ID: 121
Now, in this case, there's nothing semantic going on in the query, right.
---
ID: 122
It's just purely going to be filtering, but the filter
---
ID: 123
is going to be a comparison.
---
ID: 124
and it's going to be a quality comparison.
---
ID: 125
We see that we can see that attribute is going to be color.
---
ID: 126
The value is going to be red.
---
ID: 127
So sure enough, if we look at what gets returned back, we
---
ID: 128
can see that we've got back.
---
ID: 129
these nice results here of where we've got, an Italian red wine.
---
ID: 130
We can see the, you know, for this color, red color, red color, red color red.
---
ID: 131
So we've got a variety of different ones there.
---
ID: 132
If we want to do some sort of semantic search now where I'm saying, okay,
---
ID: 133
I want a wine that has fruity nodes.
---
ID: 134
and, it's going to basically now do the search and I can see, okay, this
---
ID: 135
wine has a crisp white, tropical fruit and citrus flavors, right.
---
ID: 136
Which fits out our description.
---
ID: 137
You can see that we get back all the metadata as well.
---
ID: 138
we've got another one where this has got dark fruit flavors.
---
ID: 139
Again, that fits the fruity nodes in here.
---
ID: 140
so we can do a variety of different searches.
---
ID: 141
What if I say, okay, I want a wine that has fruity nodes and
---
ID: 142
a rating above 97 in this case.
---
ID: 143
so here it's got our comparitor where I've got my greater than at rating, 97.
---
ID: 144
and it's bringing things back that again, relate to fruit.
---
ID: 145
So apricot and peach red fruit, earthy notes there.
---
ID: 146
What if I say, I want wines from Italy.
---
ID: 147
So now this is no query on this.
---
ID: 148
You can see here, the query up there for that last one was fruity.
---
ID: 149
Right?
---
ID: 150
we can see that this one has no semantic query, but it has
---
ID: 151
an equality country, Italy.
---
ID: 152
We get the Italian red ones back.
---
ID: 153
what if we want to do a composite of a few things?
---
ID: 154
So here I could say, okay, I want a wine that's going to be that's all earthy.
---
ID: 155
and it's going to be between 2015 and 2020.
---
ID: 156
and sure enough, you can see that it's worked out that the, The semantic
---
ID: 157
element to look up is earthy in here.
---
ID: 158
And then here, we've got an operator of and, and we've got this comparison
---
ID: 159
of, greater than year 2015 and greater than a year, less than 2020 in here.
---
ID: 160
And it's able then to basically bring back the data that we want.
---
ID: 161
So this shows us that we can do a Whole variety of different searches
---
ID: 162
that comprise both filtering the metadata, but also using the semantic.
---
ID: 163
look up data of the vector store on those descriptions that we've got in there.
---
ID: 164
Another thing that we can do is we can actually limit these things.
---
ID: 165
So if we do want to just limit it to, if we've got, you know, 10,000 wines in there
---
ID: 166
probably don't want to return 5,000 wines.
---
ID: 167
So we can do a limit in here.
---
ID: 168
So here I'm saying, okay, what.
---
ID: 169
and that limit is basically the model working it out in this case.
---
ID: 170
So you can see here, we've got where I've put what are two
---
ID: 171
that have a rating above 97.
---
ID: 172
So there's no Semantic query in here.
---
ID: 173
we've got the greater than rating above 97 and we've got limit equals two.
---
ID: 174
so it's just probably giving us the first two, in there.
---
ID: 175
I want you to see that because we're using the large language
---
ID: 176
model to rewrite our query.
---
ID: 177
We can do things, you know, wrong in here where I can say, okay, what are two wines
---
ID: 178
that come from Australia or New Zealand?
---
ID: 179
you'll notice that I've deliberately, not put the capitalization's at times.
---
ID: 180
And you'll find that even if we put some, misspellings and stuff like that.
---
ID: 181
The language model.
---
ID: 182
If you've got a good language model will work out the difference there
---
ID: 183
and be able to then fix this up.
---
ID: 184
So in this case, it's returned back to wines, which is what we asked for.
---
ID: 185
We can see that we've got the quality equals Australia or
---
ID: 186
quality equals New Zealand.
---
ID: 187
That limit equals two.
---
ID: 188
and then finally, Sure enough, we get back our cloudy bay wine with
---
ID: 189
a rating of 92 from new zealand.
---
ID: 190
And we also get back a Penfolds grange from australia here.
---
ID: 191
So hopefully this gives you a taste of how you can build a more advanced retrieval
---
ID: 192
augmented generation system That uses.
---
ID: 193
the concept of metadata to filter things as well as purely semantic search.
---
ID: 194
So this concept will work with other language models It
---
ID: 195
doesn't have to be with OpenAI.
---
ID: 196
i've just done that for convenience in here like i said
---
ID: 197
you could do this with LLaMA-2.
---
ID: 198
You will need to make sure that you're getting a language model
---
ID: 199
that can take these kinds of queries And process them for this.
---
ID: 200
So try this out.
---
ID: 201
i find that this is a way that people can actually do a lot more with
---
ID: 202
retrieval augmented generation than just the sort of minimal standard looking
---
ID: 203
things up by semantic search alone.
---
ID: 204
Anyway as always if you've got questions please put them in the comments below.
---
ID: 205
if you found the video useful and want to see more videos like this
---
ID: 206
please check out my channel click like and subscribe et cetera.
---
ID: 207
i will talk to you in the next video bye for now
`.trim(),
    },
  };
