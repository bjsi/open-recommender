import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { RecommendClipsCustomInput } from "../schemas/recommendClipsInputSchema";
import { Tweet } from "../../../../twitter/schemas";
import { TranscriptCue } from "../../../../youtube/transcript";

const tweets: Tweet[] = [
  {
    id: 1724088133887664400,
    id_str: "1724088133887664365",
    url: "https://twitter.com/experilearning/status/1724088133887664365",
    date: "2023-11-13 15:33:37+00:00",
    user: {
      id: 1318176552652243000,
      id_str: "1318176552652242944",
      url: "https://twitter.com/experilearning",
      username: "experilearning",
      displayname: "Jamesb",
      rawDescription:
        "fascinated by LLM agents | building the best SRS app in the multiverse @rem_note",
      created: "2020-10-19 13:06:10+00:00",
      followersCount: 888,
      friendsCount: 368,
      statusesCount: 847,
      favouritesCount: 1118,
      listedCount: 32,
      mediaCount: 179,
      location: "Oxford, UK",
      profileImageUrl:
        "https://pbs.twimg.com/profile_images/1318177040563044352/wc9oSp4b_normal.jpg",
      profileBannerUrl: null,
      protected: null,
      verified: false,
      blue: true,
      blueType: null,
      descriptionLinks: [
        {
          url: "https://bjsi.github.io/",
          text: "bjsi.github.io",
          tcourl: "https://t.co/pUoG8zy05Z",
        },
      ],
      _type: "snscrape.modules.twitter.User",
    },
    lang: "en",
    rawContent:
      "Exporting and pre-processing to get RAG working is extremely tedious. My journals are messy hierarchies of markdown bullets of varying lengths with topics spread all over the page. I threw GPT-4 at the problem and rewrote, chunked, and attached metadata for all of the journals 🤷‍♂️",
    replyCount: 3,
    retweetCount: 0,
    likeCount: 3,
    quoteCount: 0,
    conversationId: 1724088133887664400,
    hashtags: [],
    cashtags: [],
    mentionedUsers: [],
    links: [],
    viewCount: 301,
    retweetedTweet: null,
    quotedTweet: {
      id: 1721956561545789400,
      id_str: "1721956561545789527",
      url: "https://twitter.com/experilearning/status/1721956561545789527",
      date: "2023-11-07 18:23:31+00:00",
      user: {
        id: 1318176552652243000,
        id_str: "1318176552652242944",
        url: "https://twitter.com/experilearning",
        username: "experilearning",
        displayname: "Jamesb",
        rawDescription:
          "fascinated by LLM agents | building the best SRS app in the multiverse @rem_note",
        created: "2020-10-19 13:06:10+00:00",
        followersCount: 888,
        friendsCount: 368,
        statusesCount: 847,
        favouritesCount: 1118,
        listedCount: 32,
        mediaCount: 179,
        location: "Oxford, UK",
        profileImageUrl:
          "https://pbs.twimg.com/profile_images/1318177040563044352/wc9oSp4b_normal.jpg",
        profileBannerUrl: null,
        protected: null,
        verified: false,
        blue: true,
        blueType: null,
        descriptionLinks: [
          {
            url: "https://bjsi.github.io/",
            text: "bjsi.github.io",
            tcourl: "https://t.co/pUoG8zy05Z",
          },
        ],
        _type: "snscrape.modules.twitter.User",
      },
      lang: "en",
      rawContent:
        "Experimenting with creating a AI journalling assistant rn. Getting the RAG/chat memory right is the most important part. Here's the approach that got the best results so far:\n\n- take each paragraph\n- add metadata using gpt (emotions mentioned, people mentioned, topics mentioned)\n- for each theme (emotion/topic/person) take all paragraphs mentioning that theme and summarise using GPT\n- when writing a new journal entry, extract themes (emotions/topics/people), then include all the summaries for those themes and get the AI to question you\n\nIt feels way better than naive RAG. Obviously it's more work, more expensive and you end up having to keep doing LLM calls to update the summaries over time, but I think it's worth it.",
      replyCount: 3,
      retweetCount: 0,
      likeCount: 7,
      quoteCount: 1,
      conversationId: 1721956561545789400,
      hashtags: [],
      cashtags: [],
      mentionedUsers: [],
      links: [],
      viewCount: 882,
      retweetedTweet: null,
      quotedTweet: null,
      place: null,
      coordinates: null,
      inReplyToTweetId: null,
      inReplyToUser: null,
      source:
        '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
      sourceUrl: "https://mobile.twitter.com",
      sourceLabel: "Twitter Web App",
      media: {
        photos: [],
        videos: [],
        animated: [],
      },
      _type: "snscrape.modules.twitter.Tweet",
    },
    place: null,
    coordinates: null,
    inReplyToTweetId: null,
    inReplyToUser: null,
    source:
      '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
    sourceUrl: "https://mobile.twitter.com",
    sourceLabel: "Twitter Web App",
    media: {
      photos: [],
      videos: [],
      animated: [],
    },
    _type: "snscrape.modules.twitter.Tweet",
  },
];

const cues: TranscriptCue[] = [
  {
    videoTitle: "Advanced RAG 01: Self Querying Retriever",
    text: "Okay.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=0s",
    start: 0,
    end: 1,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So in this video, I'm going to address one of the biggest issues that I",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=0s",
    start: 0,
    end: 4,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "see people having problems with in relation to building RAG systems or",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=0s",
    start: 0,
    end: 11,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "retrieval augmented generation systems.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=10s",
    start: 10,
    end: 13,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and that is that they try to use semantic search for everything.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=13s",
    start: 13,
    end: 17,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "you only want to use semantic search where it makes sense to use semantic search.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=17s",
    start: 17,
    end: 22,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "If you're doing search on things that would be the kind of things",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=21s",
    start: 21,
    end: 26,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "that are in a normal database that you would just look up an integer,",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=25s",
    start: 25,
    end: 30,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "look up a string, that kind of thing.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=29s",
    start: 29,
    end: 32,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "You actually don't want to use those for doing semantic search.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=31s",
    start: 31,
    end: 36,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "You want to do semantic search where you've got text that you're trying to",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=35s",
    start: 35,
    end: 40,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "extract semantic, meaning out of that.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=39s",
    start: 39,
    end: 42,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this brings us to the whole concept of self querying retrieval.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=41s",
    start: 41,
    end: 47,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "if we look at the diagram for this, we can see that the idea here is that.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=47s",
    start: 47,
    end: 52,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We have a sort of step between the retrieval and the input.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=52s",
    start: 52,
    end: 58,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So the person types in their query.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=57s",
    start: 57,
    end: 60,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and then we use a large language model to reformat that query to get",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=59s",
    start: 59,
    end: 65,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "both the semantic elements of that, but also to be able to convert it",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=64s",
    start: 64,
    end: 70,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "so that we can actually do searches on metadata as we go through this.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=69s",
    start: 69,
    end: 74,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this is a fundamental fact that if you're looking for a movie and you",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=73s",
    start: 73,
    end: 80,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "want to basically specify the year, you don't want to look for the year using",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=79s",
    start: 79,
    end: 84,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "a vector store in semantic search.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=83s",
    start: 83,
    end: 86,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "You want to basically just do a lookup that looks at the year and",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=85s",
    start: 85,
    end: 90,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "filters the results back based on that year that you put in.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=89s",
    start: 89,
    end: 93,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Just the same if you were doing something for doing searches on Spotify or doing",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=93s",
    start: 93,
    end: 99,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "such as with music, if the person gives you the name of the artist,",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=98s",
    start: 98,
    end: 103,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "you don't want to use semantic search to look up the name of the artist.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=102s",
    start: 102,
    end: 106,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "You want to do a query that looks for that artists and then uses the semantic",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=106s",
    start: 106,
    end: 112,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "search for doing the parts where semantic search is actually strong in this.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=111s",
    start: 111,
    end: 116,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So let's jump in, have a look at this in LangChain.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=115s",
    start: 115,
    end: 118,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So we're going to be using the self querying retriever here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=117s",
    start: 117,
    end: 121,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "now I'm using OpenAI embeddings and the OpenAI models.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=121s",
    start: 121,
    end: 126,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "you can swap out, these for, you know, the other models like",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=125s",
    start: 125,
    end: 130,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "I've done in many videos before.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=129s",
    start: 129,
    end: 132,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And maybe at some point I'll do an end-to-end example of building an app with",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=131s",
    start: 131,
    end: 136,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "this using LLaMA-2 and say BGE embeddings.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=135s",
    start: 135,
    end: 139,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "I've just gone for these cause so that these parts are not",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=139s",
    start: 139,
    end: 142,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "the important part in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=141s",
    start: 141,
    end: 143,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And the code doesn't take up too much room.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=143s",
    start: 143,
    end: 145,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So I'm using chroma as my vector store in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=145s",
    start: 145,
    end: 149,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "like I said, I'm using the OpenAI embeddings.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=149s",
    start: 149,
    end: 152,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and then I'm going to pass in data.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=151s",
    start: 151,
    end: 155,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this is where you would put a lot of effort into preparing your data.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=154s",
    start: 154,
    end: 160,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "In this case, I'm going to be doing search over wines.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=159s",
    start: 159,
    end: 164,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And wine's going to have a number of different things in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=164s",
    start: 164,
    end: 168,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So you can see that we've got a description of the wine that's in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=167s",
    start: 167,
    end: 173,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We've got the name of the wine.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=172s",
    start: 172,
    end: 175,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We've got the year.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=175s",
    start: 175,
    end: 177,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We've got the rating that it's got.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=176s",
    start: 176,
    end: 179,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We've got the type of, grape, in there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=178s",
    start: 178,
    end: 183,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We've also got the color of the wine.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=182s",
    start: 182,
    end: 186,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And finally, we've got the country of where the wine comes from.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=186s",
    start: 186,
    end: 189,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So all of these things are metadata that we're putting in,",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=189s",
    start: 189,
    end: 193,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And he, you can see that I've got these for a number of different wines in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=193s",
    start: 193,
    end: 198,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Now, Which part where we use the semantic search on?",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=197s",
    start: 197,
    end: 200,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We would use it on this description that we've got here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=200s",
    start: 200,
    end: 204,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So the description is what's going to be actually used for doing the search.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=203s",
    start: 203,
    end: 208,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So you'll see, as we go through it, that if we talk about things",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=207s",
    start: 207,
    end: 212,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "like, fruity notes or that kind of thing, It's able to work out that,",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=211s",
    start: 211,
    end: 217,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "okay, apricot and peaches are fruit.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=216s",
    start: 216,
    end: 219,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "black fruit, stone fruits.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=218s",
    start: 218,
    end: 221,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "These are sorts of things that relate to fruit, citrus flavors.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=220s",
    start: 220,
    end: 224,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "but if we're talking about a year, we don't want it to just",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=224s",
    start: 224,
    end: 228,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "do semantic search over that.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=227s",
    start: 227,
    end: 229,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We want it to use a specific year and filter by that year.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=229s",
    start: 229,
    end: 233,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So we've got our data in here and you could spend quite a bit of time going",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=233s",
    start: 233,
    end: 238,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "through and, working out the best metadata for your particular use case one of the",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=237s",
    start: 237,
    end: 243,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "things that I see a lot of people, you know, if they've got a CSV file and a",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=242s",
    start: 242,
    end: 248,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "lot of the data would make good metadata.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=247s",
    start: 247,
    end: 250,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And then part of it would be used for the semantic search.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=249s",
    start: 249,
    end: 253,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "This is a perfect example that you could do this.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=252s",
    start: 252,
    end: 255,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And you could basically write a little function that would go through",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=254s",
    start: 254,
    end: 258,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "your CSV file, take it out and convert it to something like this",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=257s",
    start: 257,
    end: 261,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "for all your different examples.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=260s",
    start: 260,
    end: 263,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "All right.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=263s",
    start: 263,
    end: 264,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "once we've got these, we basically need to embed them and",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=263s",
    start: 263,
    end: 267,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "put them into our vector store.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=266s",
    start: 266,
    end: 268,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this is what the last line here is doing.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=267s",
    start: 267,
    end: 270,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "It's just making a chroma DB from documents.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=269s",
    start: 269,
    end: 274,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We're passing in these documents.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=273s",
    start: 273,
    end: 275,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We're passing in what to use to do the embeddings.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=274s",
    start: 274,
    end: 278,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And it's going to embed these part and it's going to keep the",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=277s",
    start: 277,
    end: 281,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "metadata separate for these.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=280s",
    start: 280,
    end: 283,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "All right.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=283s",
    start: 283,
    end: 284,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So next step, what we need to do is create our self querying retriever here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=283s",
    start: 283,
    end: 288,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this is something that's built into LangChain.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=288s",
    start: 288,
    end: 291,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "the key thing that we need to do though, is we need to tell it the metadata info.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=291s",
    start: 291,
    end: 296,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So you see that each one of these relates to one of the types of",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=296s",
    start: 296,
    end: 301,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "metadata that we've got in there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=300s",
    start: 300,
    end: 303,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So we've got grape, which is the great use to make the wine.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=302s",
    start: 302,
    end: 306,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "we've got the name of the wine and you'll see that these are",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=306s",
    start: 306,
    end: 310,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "strings or list of string in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=309s",
    start: 309,
    end: 312,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "we've got the year is going to be an integer.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=312s",
    start: 312,
    end: 315,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "we've got the country here, we've got the color of the wine.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=315s",
    start: 315,
    end: 319,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We've got the rating.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=318s",
    start: 318,
    end: 321,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Now the rating in this case is an integer, but if you were using something like, you",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=320s",
    start: 320,
    end: 325,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "know, score out of five and you could have 3.7 out of five, then you would change",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=324s",
    start: 324,
    end: 330,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "that to be a float for this kind of thing.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=329s",
    start: 329,
    end: 332,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And so the model that we're using actually knows what a Robert Parker rating is.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=331s",
    start: 331,
    end: 338,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this is a famous wine reviewer and the ratings that we've got there,",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=337s",
    start: 337,
    end: 342,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "based on that kind of rating in there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=341s",
    start: 341,
    end: 345,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "I'm not sure if they're totally accurate, but it gives you a sort of sense of this.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=344s",
    start: 344,
    end: 348,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "country, obviously that's going to be a string.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=348s",
    start: 348,
    end: 351,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and then for the semantic bit, this is going to be a brief description",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=350s",
    start: 350,
    end: 356,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "of the wine that we've got there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=355s",
    start: 355,
    end: 358,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So once we've got that, we then basically set up out our large language model.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=357s",
    start: 357,
    end: 363,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Again, in this case, we're just using the OpenAI model.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=362s",
    start: 362,
    end: 367,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "But you could use a LLaMA-2, you could use, you know, a variety of",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=366s",
    start: 366,
    end: 371,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "different ones that you want here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=370s",
    start: 370,
    end: 373,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Right then we basically set up our retriever.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=372s",
    start: 372,
    end: 375,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "are we going to pass in the LLM?",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=374s",
    start: 374,
    end: 377,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "The vector store?",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=376s",
    start: 376,
    end: 378,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "All of this is very similar to just normal retrieval, augmented",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=377s",
    start: 377,
    end: 381,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "generation with LangChain.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=380s",
    start: 380,
    end: 383,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "the next things we want to pass in is okay.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=382s",
    start: 382,
    end: 385,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "What do we actually do the query on, and also the Meta data fields info in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=384s",
    start: 384,
    end: 391,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So these are the sort of two differences that we would do from a normal rag system.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=390s",
    start: 390,
    end: 396,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Now you'll see that we can go through and we can query.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=396s",
    start: 396,
    end: 400,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and what actually happens is that the model will take our input,",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=399s",
    start: 399,
    end: 406,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "which in this case, is the, what, you know, what are some red wines?",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=405s",
    start: 405,
    end: 410,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And it will write a query.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=410s",
    start: 410,
    end: 413,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Now, in this case, there's nothing semantic going on in the query, right.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=412s",
    start: 412,
    end: 416,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "It's just purely going to be filtering, but the filter",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=415s",
    start: 415,
    end: 420,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "is going to be a comparison.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=419s",
    start: 419,
    end: 421,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and it's going to be a quality comparison.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=421s",
    start: 421,
    end: 424,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We see that we can see that attribute is going to be color.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=423s",
    start: 423,
    end: 427,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "The value is going to be red.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=426s",
    start: 426,
    end: 429,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So sure enough, if we look at what gets returned back, we",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=428s",
    start: 428,
    end: 433,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "can see that we've got back.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=432s",
    start: 432,
    end: 435,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "these nice results here of where we've got, an Italian red wine.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=434s",
    start: 434,
    end: 441,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We can see the, you know, for this color, red color, red color, red color red.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=440s",
    start: 440,
    end: 445,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So we've got a variety of different ones there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=444s",
    start: 444,
    end: 447,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "If we want to do some sort of semantic search now where I'm saying, okay,",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=447s",
    start: 447,
    end: 452,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "I want a wine that has fruity nodes.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=451s",
    start: 451,
    end: 454,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and, it's going to basically now do the search and I can see, okay, this",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=454s",
    start: 454,
    end: 460,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "wine has a crisp white, tropical fruit and citrus flavors, right.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=459s",
    start: 459,
    end: 465,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Which fits out our description.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=464s",
    start: 464,
    end: 467,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "You can see that we get back all the metadata as well.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=466s",
    start: 466,
    end: 470,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "we've got another one where this has got dark fruit flavors.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=469s",
    start: 469,
    end: 473,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Again, that fits the fruity nodes in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=472s",
    start: 472,
    end: 476,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "so we can do a variety of different searches.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=475s",
    start: 475,
    end: 479,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "What if I say, okay, I want a wine that has fruity nodes and",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=478s",
    start: 478,
    end: 483,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "a rating above 97 in this case.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=482s",
    start: 482,
    end: 486,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "so here it's got our comparitor where I've got my greater than at rating, 97.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=486s",
    start: 486,
    end: 494,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and it's bringing things back that again, relate to fruit.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=493s",
    start: 493,
    end: 497,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So apricot and peach red fruit, earthy notes there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=496s",
    start: 496,
    end: 501,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "What if I say, I want wines from Italy.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=501s",
    start: 501,
    end: 504,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So now this is no query on this.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=503s",
    start: 503,
    end: 507,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "You can see here, the query up there for that last one was fruity.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=506s",
    start: 506,
    end: 510,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Right?",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=510s",
    start: 510,
    end: 511,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "we can see that this one has no semantic query, but it has",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=510s",
    start: 510,
    end: 515,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "an equality country, Italy.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=514s",
    start: 514,
    end: 517,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We get the Italian red ones back.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=516s",
    start: 516,
    end: 519,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "what if we want to do a composite of a few things?",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=519s",
    start: 519,
    end: 522,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So here I could say, okay, I want a wine that's going to be that's all earthy.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=521s",
    start: 521,
    end: 529,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and it's going to be between 2015 and 2020.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=528s",
    start: 528,
    end: 532,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and sure enough, you can see that it's worked out that the, The semantic",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=532s",
    start: 532,
    end: 537,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "element to look up is earthy in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=536s",
    start: 536,
    end: 539,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And then here, we've got an operator of and, and we've got this comparison",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=538s",
    start: 538,
    end: 543,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "of, greater than year 2015 and greater than a year, less than 2020 in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=543s",
    start: 543,
    end: 552,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And it's able then to basically bring back the data that we want.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=551s",
    start: 551,
    end: 556,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this shows us that we can do a Whole variety of different searches",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=555s",
    start: 555,
    end: 560,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "that comprise both filtering the metadata, but also using the semantic.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=559s",
    start: 559,
    end: 567,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "look up data of the vector store on those descriptions that we've got in there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=566s",
    start: 566,
    end: 572,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Another thing that we can do is we can actually limit these things.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=571s",
    start: 571,
    end: 575,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So if we do want to just limit it to, if we've got, you know, 10,000 wines in there",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=574s",
    start: 574,
    end: 580,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "probably don't want to return 5,000 wines.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=579s",
    start: 579,
    end: 582,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So we can do a limit in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=581s",
    start: 581,
    end: 585,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So here I'm saying, okay, what.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=584s",
    start: 584,
    end: 586,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and that limit is basically the model working it out in this case.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=586s",
    start: 586,
    end: 592,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So you can see here, we've got where I've put what are two",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=591s",
    start: 591,
    end: 595,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "that have a rating above 97.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=595s",
    start: 595,
    end: 598,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So there's no Semantic query in here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=597s",
    start: 597,
    end: 601,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "we've got the greater than rating above 97 and we've got limit equals two.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=600s",
    start: 600,
    end: 606,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "so it's just probably giving us the first two, in there.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=605s",
    start: 605,
    end: 610,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "I want you to see that because we're using the large language",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=609s",
    start: 609,
    end: 613,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "model to rewrite our query.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=612s",
    start: 612,
    end: 615,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We can do things, you know, wrong in here where I can say, okay, what are two wines",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=614s",
    start: 614,
    end: 619,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "that come from Australia or New Zealand?",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=618s",
    start: 618,
    end: 620,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "you'll notice that I've deliberately, not put the capitalization's at times.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=620s",
    start: 620,
    end: 625,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And you'll find that even if we put some, misspellings and stuff like that.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=624s",
    start: 624,
    end: 630,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "The language model.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=629s",
    start: 629,
    end: 631,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "If you've got a good language model will work out the difference there",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=630s",
    start: 630,
    end: 634,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and be able to then fix this up.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=633s",
    start: 633,
    end: 636,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So in this case, it's returned back to wines, which is what we asked for.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=635s",
    start: 635,
    end: 641,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "We can see that we've got the quality equals Australia or",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=640s",
    start: 640,
    end: 645,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "quality equals New Zealand.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=644s",
    start: 644,
    end: 648,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "That limit equals two.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=647s",
    start: 647,
    end: 650,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "and then finally, Sure enough, we get back our cloudy bay wine with",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=649s",
    start: 649,
    end: 654,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "a rating of 92 from new zealand.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=653s",
    start: 653,
    end: 657,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "And we also get back a Penfolds grange from australia here.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=656s",
    start: 656,
    end: 661,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So hopefully this gives you a taste of how you can build a more advanced retrieval",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=661s",
    start: 661,
    end: 667,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "augmented generation system That uses.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=666s",
    start: 666,
    end: 671,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "the concept of metadata to filter things as well as purely semantic search.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=670s",
    start: 670,
    end: 676,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So this concept will work with other language models It",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=675s",
    start: 675,
    end: 679,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "doesn't have to be with OpenAI.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=678s",
    start: 678,
    end: 681,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "i've just done that for convenience in here like i said",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=680s",
    start: 680,
    end: 684,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "you could do this with LLaMA-2.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=683s",
    start: 683,
    end: 686,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "You will need to make sure that you're getting a language model",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=685s",
    start: 685,
    end: 688,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "that can take these kinds of queries And process them for this.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=687s",
    start: 687,
    end: 691,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "So try this out.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=691s",
    start: 691,
    end: 693,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "i find that this is a way that people can actually do a lot more with",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=692s",
    start: 692,
    end: 698,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "retrieval augmented generation than just the sort of minimal standard looking",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=697s",
    start: 697,
    end: 703,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "things up by semantic search alone.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=702s",
    start: 702,
    end: 705,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "Anyway as always if you've got questions please put them in the comments below.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=705s",
    start: 705,
    end: 710,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "if you found the video useful and want to see more videos like this",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=709s",
    start: 709,
    end: 713,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "please check out my channel click like and subscribe et cetera.",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=713s",
    start: 713,
    end: 717,
  },
  {
    videoTitle: "Advanced RAG 01: Self Querying",
    text: "i will talk to you in the next video bye for now",

    url: "https://www.youtube.com/watch?v=f4LeWlt3T8Y&t=716s",
    start: 716,
    end: 719,
  },
];

export const relatedDataset: ExampleDataSet<RecommendClipsCustomInput> = {
  user: {
    name: "experilearning",
    value: "experilearning",
  },
  url: {
    name: "url",
    value: "https://www.youtube.com/watch?v=f4LeWlt3T8Y",
  },
  videoId: {
    name: "Advanced RAG 01",
    value: "f4LeWlt3T8Y",
  },
  title: {
    name: "rag",
    value: "Advanced RAG 01",
  },
  tweets: {
    name: "ai-therapist-tweets",
    value: tweets,
  },
  transcript: {
    name: "advanced-rag",
    value: cues,
  },
};
