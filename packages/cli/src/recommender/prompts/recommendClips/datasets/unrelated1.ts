import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { Tweet } from "../../../../twitter/schemas";
import { TranscriptCue } from "../../../../youtube/transcript";
import { RecommendClipsCustomInput } from "../schemas/recommendClipsInputSchema";

const tweets: Tweet[] = [
  {
    id: 1732293110988734700,
    id_str: "1732293110988734681",
    url: "https://twitter.com/experilearning/status/1732293110988734681",
    date: "2023-12-06 06:57:16+00:00",
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
      "POV: 26 mins in to the recommendation flow, the pipeline explodes at the final stage\n\nbefore adding checkpointing: 😠 FUCK\nafter adding checkpointing: 🤷‍♂️ ez restore and re-run\n\nread more about the data pipeline here: https://t.co/C2E2EFOlph https://t.co/5unxPqhkrL",
    replyCount: 0,
    retweetCount: 0,
    likeCount: 1,
    quoteCount: 0,
    conversationId: 1732293110988734700,
    hashtags: [],
    cashtags: [],
    mentionedUsers: [],
    links: [
      {
        url: "https://dev.to/experilearning/managing-long-running-llm-data-processing-pipelines-48f9",
        text: "dev.to/experilearning…",
        tcourl: "https://t.co/C2E2EFOlph",
      },
    ],
    viewCount: 219,
    retweetedTweet: null,
    quotedTweet: {
      id: 1731570914112807000,
      id_str: "1731570914112807040",
      url: "https://twitter.com/experilearning/status/1731570914112807040",
      date: "2023-12-04 07:07:31+00:00",
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
        "@ErikBjare data pipeline is looking clean ✨ it takes a while to run and can be tough to debug so I added a pipeline abstraction to save the inputs, outputs and errors of each stage allowing me to restart a run from a particular stage https://t.co/CbbIQV9RTK",
      replyCount: 3,
      retweetCount: 0,
      likeCount: 2,
      quoteCount: 1,
      conversationId: 1727204603719238000,
      hashtags: [],
      cashtags: [],
      mentionedUsers: [
        {
          id: 324745557,
          username: "ErikBjare",
          displayname: "Erik Bjäreholt",
          _type: "snscrape.modules.twitter.UserRef",
        },
      ],
      links: [],
      viewCount: 430,
      retweetedTweet: null,
      quotedTweet: null,
      place: null,
      coordinates: null,
      inReplyToTweetId: 1727204603719238000,
      inReplyToUser: {
        id: 1318176552652243000,
        username: "experilearning",
        displayname: "Jamesb",
        _type: "snscrape.modules.twitter.UserRef",
      },
      source:
        '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
      sourceUrl: "https://mobile.twitter.com",
      sourceLabel: "Twitter Web App",
      media: {
        photos: [
          {
            url: "https://pbs.twimg.com/media/GAfGHsYWwAAC8xV.jpg",
          },
        ],
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
      photos: [
        {
          url: "https://pbs.twimg.com/media/GApPf3VWsAEvA9W.jpg",
        },
      ],
      videos: [],
      animated: [],
    },
    _type: "snscrape.modules.twitter.Tweet",
  },
  {
    id: 1732293110988734700,
    id_str: "1732293110988734681",
    url: "https://twitter.com/experilearning/status/1732293110988734681",
    date: "2023-12-06 06:57:16+00:00",
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
      "POV: 26 mins in to the recommendation flow, the pipeline explodes at the final stage\n\nbefore adding checkpointing: 😠 FUCK\nafter adding checkpointing: 🤷‍♂️ ez restore and re-run\n\nread more about the data pipeline here: https://t.co/C2E2EFOlph https://t.co/5unxPqhkrL",
    replyCount: 0,
    retweetCount: 0,
    likeCount: 1,
    quoteCount: 0,
    conversationId: 1732293110988734700,
    hashtags: [],
    cashtags: [],
    mentionedUsers: [],
    links: [
      {
        url: "https://dev.to/experilearning/managing-long-running-llm-data-processing-pipelines-48f9",
        text: "dev.to/experilearning…",
        tcourl: "https://t.co/C2E2EFOlph",
      },
    ],
    viewCount: 219,
    retweetedTweet: null,
    quotedTweet: {
      id: 1731570914112807000,
      id_str: "1731570914112807040",
      url: "https://twitter.com/experilearning/status/1731570914112807040",
      date: "2023-12-04 07:07:31+00:00",
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
        "@ErikBjare data pipeline is looking clean ✨ it takes a while to run and can be tough to debug so I added a pipeline abstraction to save the inputs, outputs and errors of each stage allowing me to restart a run from a particular stage https://t.co/CbbIQV9RTK",
      replyCount: 3,
      retweetCount: 0,
      likeCount: 2,
      quoteCount: 1,
      conversationId: 1727204603719238000,
      hashtags: [],
      cashtags: [],
      mentionedUsers: [
        {
          id: 324745557,
          username: "ErikBjare",
          displayname: "Erik Bjäreholt",
          _type: "snscrape.modules.twitter.UserRef",
        },
      ],
      links: [],
      viewCount: 430,
      retweetedTweet: null,
      quotedTweet: null,
      place: null,
      coordinates: null,
      inReplyToTweetId: 1727204603719238000,
      inReplyToUser: {
        id: 1318176552652243000,
        username: "experilearning",
        displayname: "Jamesb",
        _type: "snscrape.modules.twitter.UserRef",
      },
      source:
        '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
      sourceUrl: "https://mobile.twitter.com",
      sourceLabel: "Twitter Web App",
      media: {
        photos: [
          {
            url: "https://pbs.twimg.com/media/GAfGHsYWwAAC8xV.jpg",
          },
        ],
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
      photos: [
        {
          url: "https://pbs.twimg.com/media/GApPf3VWsAEvA9W.jpg",
        },
      ],
      videos: [],
      animated: [],
    },
    _type: "snscrape.modules.twitter.Tweet",
  },
  {
    id: 1732280684956496000,
    id_str: "1732280684956495906",
    url: "https://twitter.com/experilearning/status/1732280684956495906",
    date: "2023-12-06 06:07:54+00:00",
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
      "@ritvvijparrikh just published the first article :) https://t.co/689x0xUG5w",
    replyCount: 0,
    retweetCount: 0,
    likeCount: 0,
    quoteCount: 0,
    conversationId: 1731947626747040300,
    hashtags: [],
    cashtags: [],
    mentionedUsers: [
      {
        id: 270977983,
        username: "ritvvijparrikh",
        displayname: "ritvvij.parrikh.com",
        _type: "snscrape.modules.twitter.UserRef",
      },
    ],
    links: [
      {
        url: "https://x.com/experilearning/status/1732116915605082225?s=20",
        text: "x.com/experilearning…",
        tcourl: "https://t.co/689x0xUG5w",
      },
    ],
    viewCount: 21,
    retweetedTweet: null,
    quotedTweet: {
      id: 1732116915605082000,
      id_str: "1732116915605082225",
      url: "https://twitter.com/experilearning/status/1732116915605082225",
      date: "2023-12-05 19:17:08+00:00",
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
        "Just published an article about Open Recommender (aka the recommendation system for the terminally online)\n\nOpen Recommender is an open source, LLM-powered recommendation system that takes your Twitter as input and gives you YouTube video recommendations\n\nhttps://t.co/BdJ3KfKikv",
      replyCount: 1,
      retweetCount: 2,
      likeCount: 15,
      quoteCount: 1,
      conversationId: 1732116915605082000,
      hashtags: [],
      cashtags: [],
      mentionedUsers: [],
      links: [
        {
          url: "https://dev.to/experilearning/building-an-llm-powered-open-source-recommendation-system-40fg",
          text: "dev.to/experilearning…",
          tcourl: "https://t.co/BdJ3KfKikv",
        },
      ],
      viewCount: 737,
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
    inReplyToTweetId: 1731972951761977600,
    inReplyToUser: {
      id: 270977983,
      username: "ritvvijparrikh",
      displayname: "ritvvij.parrikh.com",
      _type: "snscrape.modules.twitter.UserRef",
    },
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
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "us but you know I spoke to Elon a few",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4647s",
    start: 4647,
    end: 4648,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "times recently about you about blue",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4649s",
    start: 4649,
    end: 4650,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "origin and he was very positive about",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4652s",
    start: 4652,
    end: 4653,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you as a person and very supportive of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4654s",
    start: 4654,
    end: 4655,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "all the efforts you've been leading at",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4656s",
    start: 4656,
    end: 4657,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "Blue what's your thoughts you worked",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4658s",
    start: 4658,
    end: 4659,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "with a lot of leaders at Amazon at Blue",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4662s",
    start: 4662,
    end: 4663,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "what's your thoughts about Elon as a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4663s",
    start: 4663,
    end: 4664,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "human being and a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4665s",
    start: 4665,
    end: 4666,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "leader well I don't really know Elon",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4668s",
    start: 4668,
    end: 4669,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "very well um you know I know his public",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4671s",
    start: 4671,
    end: 4672,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "persona but I also know you can't know",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4675s",
    start: 4675,
    end: 4676,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "anyone by their public Persona um it's",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4678s",
    start: 4678,
    end: 4679,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "impossible I mean you may think you do",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4680s",
    start: 4680,
    end: 4681,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "but I guarantee you don't so I don't",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4682s",
    start: 4682,
    end: 4683,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "really know you know Elon way better",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4683s",
    start: 4683,
    end: 4684,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "than I do Lex but um in in terms of his",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4688s",
    start: 4688,
    end: 4689,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "judging by the results he must be a very",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4691s",
    start: 4691,
    end: 4692,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "capable leader um there's no way you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4694s",
    start: 4694,
    end: 4695,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "could have you know Tesla and SpaceX",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4698s",
    start: 4698,
    end: 4699,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "without being a capable leader it's",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4701s",
    start: 4701,
    end: 4702,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "impossible yeah I just I I hope you guys",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4704s",
    start: 4704,
    end: 4705,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "hang out sometimes shake hands and and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4706s",
    start: 4706,
    end: 4707,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "sort of um have a kind of friendship",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4710s",
    start: 4710,
    end: 4711,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that would Inspire just the entirety of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4711s",
    start: 4711,
    end: 4712,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "humanity because you what you're doing",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4714s",
    start: 4714,
    end: 4715,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "is like one of the big",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4716s",
    start: 4716,
    end: 4717,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "Grand challenges ahead for Humanity well",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4720s",
    start: 4720,
    end: 4721,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "I agree with you and I think in a lot of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4722s",
    start: 4722,
    end: 4723,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "these um Endeavors we're very",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4724s",
    start: 4724,
    end: 4725,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "like-minded yeah so I think you I think",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4727s",
    start: 4727,
    end: 4728,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you I'm not saying we're identical but I",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4730s",
    start: 4730,
    end: 4731,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "think we're very likeminded and so I you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4732s",
    start: 4732,
    end: 4733,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "know know I I I love that idea all right",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4736s",
    start: 4736,
    end: 4737,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "going back to uh sexy pictures on your",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4738s",
    start: 4738,
    end: 4739,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "Instagram uh there's a video of you from",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4741s",
    start: 4741,
    end: 4742,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "the early days of Amazon um giving a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4744s",
    start: 4744,
    end: 4745,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "tour of your quote sort of offices I",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4746s",
    start: 4746,
    end: 4747,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "think your dad is holding the camera he",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4748s",
    start: 4748,
    end: 4749,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "is yeah I know yes this is what the",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4750s",
    start: 4750,
    end: 4751,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "Giant Orange extension cord and yeah and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4752s",
    start: 4752,
    end: 4753,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you're like explaining the The Genius of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4754s",
    start: 4754,
    end: 4755,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "the extension cord how this a this a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4758s",
    start: 4758,
    end: 4759,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "desk and the CRT Monitor and sort of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4760s",
    start: 4760,
    end: 4761,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that's where the that's where all the",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4762s",
    start: 4762,
    end: 4763,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "magic Captain I forget what your dad",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4763s",
    start: 4763,
    end: 4764,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "said but this is like the the the center",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4766s",
    start: 4766,
    end: 4767,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "of it all so um what was it like what",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4769s",
    start: 4769,
    end: 4770,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "was going through your mind at that time",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4771s",
    start: 4771,
    end: 4772,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you left a good job in New York and took",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4775s",
    start: 4775,
    end: 4776,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "this leap were you excited were you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4777s",
    start: 4777,
    end: 4778,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "scared so excited and scared anxious you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4781s",
    start: 4781,
    end: 4782,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "know thought the odds of success were",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4783s",
    start: 4783,
    end: 4784,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "low told all of our early investors that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4786s",
    start: 4786,
    end: 4787,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "I thought there was a 30% chance of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4788s",
    start: 4788,
    end: 4789,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "success by which I just been getting",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4789s",
    start: 4789,
    end: 4790,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "your money back not like turn not what",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4792s",
    start: 4792,
    end: 4793,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "actually happened happened because",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4794s",
    start: 4794,
    end: 4795,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that's the truth every startup company",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4796s",
    start: 4796,
    end: 4797,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "is unlikely to work it's helpful to be",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4800s",
    start: 4800,
    end: 4801,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "in reality about that um but that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4803s",
    start: 4803,
    end: 4804,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "doesn't mean you can't be optimistic so",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4805s",
    start: 4805,
    end: 4806,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you kind of have to have this duality in",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4807s",
    start: 4807,
    end: 4808,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "your head like you on the one hand",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4808s",
    start: 4808,
    end: 4809,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you're you know what the Baseline",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4811s",
    start: 4811,
    end: 4812,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "statistics say about startup companies",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4814s",
    start: 4814,
    end: 4815,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "and the other hand you have to ignore",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4815s",
    start: 4815,
    end: 4816,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "all of that and just be 100% sure it's",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4818s",
    start: 4818,
    end: 4819,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "going to work and you're doing both",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4820s",
    start: 4820,
    end: 4821,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "things at the same time you're holding",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4822s",
    start: 4822,
    end: 4823,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that contra Addiction in your head but",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4824s",
    start: 4824,
    end: 4825,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "it was so so exciting I love you know",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4828s",
    start: 4828,
    end: 4829,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "every from 1994 when uh the company was",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4831s",
    start: 4831,
    end: 4832,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "founded 1995 when we opened our",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4834s",
    start: 4834,
    end: 4835,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "doors all the way until today it's I",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4838s",
    start: 4838,
    end: 4839,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "find Amazon so exciting and that doesn't",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4840s",
    start: 4840,
    end: 4841,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "mean it's like full of pain full of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4844s",
    start: 4844,
    end: 4845,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "problems you know it's like there so",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4847s",
    start: 4847,
    end: 4848,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "many things that need to be resolved and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4849s",
    start: 4849,
    end: 4850,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "worked and made better and and Etc but",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4852s",
    start: 4852,
    end: 4853,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "but on balance it's so fun it's such a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4856s",
    start: 4856,
    end: 4857,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "privilege it's been such a joy I feel so",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4859s",
    start: 4859,
    end: 4860,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "grateful that I've been part of that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4861s",
    start: 4861,
    end: 4862,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "Journey um it's just been incredible so",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4864s",
    start: 4864,
    end: 4865,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "in some sense you don't want a a single",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4866s",
    start: 4866,
    end: 4867,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "day of comfort you've written about this",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4869s",
    start: 4869,
    end: 4870,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "many times we'll talk about your writing",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4871s",
    start: 4871,
    end: 4872,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "which uh I I would highly recommend",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4873s",
    start: 4873,
    end: 4874,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "people read in just the letters to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4876s",
    start: 4876,
    end: 4877,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "shareholders uh so you wrote up uh",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4879s",
    start: 4879,
    end: 4880,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "explaining the idea of day one thinking",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4881s",
    start: 4881,
    end: 4882,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "I think you first wrote bought in 97",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4883s",
    start: 4883,
    end: 4884,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "letters to shareholders then you also in",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4886s",
    start: 4886,
    end: 4887,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "a way wrote it",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4888s",
    start: 4888,
    end: 4889,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "about sad to say is your last letter to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4891s",
    start: 4891,
    end: 4892,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "shareholders Co um and you said that day",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4895s",
    start: 4895,
    end: 4896,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "two is stasis followed by",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4899s",
    start: 4899,
    end: 4900,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "irrelevance followed by excruciating",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4902s",
    start: 4902,
    end: 4903,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "painful decline followed by death and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4906s",
    start: 4906,
    end: 4907,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that is why it's always day",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4908s",
    start: 4908,
    end: 4909,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "one um can you explain this day one",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4910s",
    start: 4910,
    end: 4911,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "thing this is a really powerful way to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4913s",
    start: 4913,
    end: 4914,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "describe the beginning and the journey",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4914s",
    start: 4914,
    end: 4915,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "of Amazon it's it's really a very simple",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4919s",
    start: 4919,
    end: 4920,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "and I think age-old idea about renewal",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4923s",
    start: 4923,
    end: 4924,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "and rebirth and like every day is day",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4927s",
    start: 4927,
    end: 4928,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "one every day you're deciding what",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4930s",
    start: 4930,
    end: 4931,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you're going to do and you are not",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4935s",
    start: 4935,
    end: 4936,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "trapped by what you were or who you were",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4938s",
    start: 4938,
    end: 4939,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "or any self-consistency self-consistency",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4941s",
    start: 4941,
    end: 4942,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "even can be trap and so day one thinking",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4945s",
    start: 4945,
    end: 4946,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "is kind of we start fresh every day and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4950s",
    start: 4950,
    end: 4951,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "we get to make new decisions every day",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4953s",
    start: 4953,
    end: 4954,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "about invention about customers about uh",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4958s",
    start: 4958,
    end: 4959,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "how we're going to operate what even",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4961s",
    start: 4961,
    end: 4962,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "even even as deeply as what our",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4963s",
    start: 4963,
    end: 4964,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "principles are we can go back to that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4965s",
    start: 4965,
    end: 4966,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "turns out we don't change those very",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4966s",
    start: 4966,
    end: 4967,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "often but we change them",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4968s",
    start: 4968,
    end: 4969,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "occasionally and um when we work on",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4973s",
    start: 4973,
    end: 4974,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "programs that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4975s",
    start: 4975,
    end: 4976,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "Amazon we often uh make a list of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4978s",
    start: 4978,
    end: 4979,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "tenants and this the tenants are kind of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4981s",
    start: 4981,
    end: 4982,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "they're not principles they're a little",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4983s",
    start: 4983,
    end: 4984,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "more tactical than principles but it's",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4985s",
    start: 4985,
    end: 4986,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "kind of the the main ideas that we want",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4989s",
    start: 4989,
    end: 4990,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "this program to embody whatever those",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4991s",
    start: 4991,
    end: 4992,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "are and one of the things that we do is",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4994s",
    start: 4994,
    end: 4995,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "we put these are the tenants for this",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4996s",
    start: 4996,
    end: 4997,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "program and in parentheses we always put",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=4999s",
    start: 4999,
    end: 5000,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "unless you know a better",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5001s",
    start: 5001,
    end: 5002,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "way and that idea unless you know a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5006s",
    start: 5006,
    end: 5007,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "better way is so important because you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5009s",
    start: 5009,
    end: 5010,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "never want to get trapped by Dogma you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5013s",
    start: 5013,
    end: 5014,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "never want to get trapped by history it",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5015s",
    start: 5015,
    end: 5016,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "doesn't mean you discard history or",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5017s",
    start: 5017,
    end: 5018,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "ignore it there's so much value in what",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5020s",
    start: 5020,
    end: 5021,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "has worked in the past and but you can't",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5023s",
    start: 5023,
    end: 5024,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "be blindly following what you've done",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5026s",
    start: 5026,
    end: 5027,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "and that's the heart of day one is",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5028s",
    start: 5028,
    end: 5029,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you're always starting fresh and uh to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5031s",
    start: 5031,
    end: 5032,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "the question of of how to fend off day",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5033s",
    start: 5033,
    end: 5034,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "two you said such a question can't have",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5035s",
    start: 5035,
    end: 5036,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "a simple answer as you're saying there",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5038s",
    start: 5038,
    end: 5039,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "will be many elements multiple paths and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5040s",
    start: 5040,
    end: 5041,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "many traps I don't know the whole answer",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5043s",
    start: 5043,
    end: 5044,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "but I may know bits of it here's a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5045s",
    start: 5045,
    end: 5046,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "starter pack of Essentials maybe others",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5047s",
    start: 5047,
    end: 5048,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "come to mind for day one",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5049s",
    start: 5049,
    end: 5050,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "defense customer Obsession uh a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5052s",
    start: 5052,
    end: 5053,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "skeptical view of proxies the eager",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5055s",
    start: 5055,
    end: 5056,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "adoption of external trends and high",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5057s",
    start: 5057,
    end: 5058,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "velocity decision making so we talked",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5059s",
    start: 5059,
    end: 5060,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "about High Velocity decision making",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5061s",
    start: 5061,
    end: 5062,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that's more difficult than it",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5063s",
    start: 5063,
    end: 5064,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "sounds so maybe you can pick one that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5066s",
    start: 5066,
    end: 5067,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "stands out to you as you can comment on",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5069s",
    start: 5069,
    end: 5070,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "uh eager adoption of external trends",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5071s",
    start: 5071,
    end: 5072,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "High Velocity decision-making skeptical",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5073s",
    start: 5073,
    end: 5074,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "view of proxies how do you fight off day",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5075s",
    start: 5075,
    end: 5076,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "two well you know I'll talk about",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5078s",
    start: 5078,
    end: 5079,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "because I think it's the one that is",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5079s",
    start: 5079,
    end: 5080,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "maybe in some ways the hardest to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5083s",
    start: 5083,
    end: 5084,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "understand um is the skeptical view of",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5088s",
    start: 5088,
    end: 5089,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "proxies um one of the things that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5090s",
    start: 5090,
    end: 5091,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "happens in business probably anything",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5093s",
    start: 5093,
    end: 5094,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that you're where you're you know you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5095s",
    start: 5095,
    end: 5096,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "have an ongoing program and something is",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5098s",
    start: 5098,
    end: 5099,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "is underway for a number of years is you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5101s",
    start: 5101,
    end: 5102,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "develop certain things that you're",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5103s",
    start: 5103,
    end: 5104,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "managing to like let's say the typical",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5105s",
    start: 5105,
    end: 5106,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "case would be a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5107s",
    start: 5107,
    end: 5108,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "metric and that metric isn't the real",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5110s",
    start: 5110,
    end: 5111,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "metric and that metric isn't the real underlying",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5110s",
    start: 5110,
    end: 5112,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "underlying",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5111s",
    start: 5111,
    end: 5112,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "thing and so uh you know maybe the",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5115s",
    start: 5115,
    end: 5116,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "metric is um efficiency metric around",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5119s",
    start: 5119,
    end: 5120,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "customer contacts per unit sold or",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5121s",
    start: 5121,
    end: 5122,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "something like if you sell a million",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5124s",
    start: 5124,
    end: 5125,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "units how many customer contacts do you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5126s",
    start: 5126,
    end: 5127,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "get or how many returns do you get and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5128s",
    start: 5128,
    end: 5129,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "so on and so on and so what happens is a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5131s",
    start: 5131,
    end: 5132,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "little bit of a kind of inertia sets",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5134s",
    start: 5134,
    end: 5135,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "in where somebody a long time ago",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5138s",
    start: 5138,
    end: 5139,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "invented that metric and they invented",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5140s",
    start: 5140,
    end: 5141,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that metric they decided we need to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5142s",
    start: 5142,
    end: 5143,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "watch for you know customer returns per",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5146s",
    start: 5146,
    end: 5147,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "unit sold as an important metric but",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5150s",
    start: 5150,
    end: 5151,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "they had a reason why they chose that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5152s",
    start: 5152,
    end: 5153,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that metric the person who invented that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5154s",
    start: 5154,
    end: 5155,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "metric and decided it was worth watching",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5157s",
    start: 5157,
    end: 5158,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "and then fast forward five years that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5159s",
    start: 5159,
    end: 5160,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "metric is the proxy MH the proxy for",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5162s",
    start: 5162,
    end: 5163,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "truth I guess the proxy for truth the",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5164s",
    start: 5164,
    end: 5165,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "proxy for customer let's say in this",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5166s",
    start: 5166,
    end: 5167,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "case it's a proxy for customer",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5168s",
    start: 5168,
    end: 5169,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "happiness and but that metric is not",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5171s",
    start: 5171,
    end: 5172,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "actually customer happiness it's a proxy",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5173s",
    start: 5173,
    end: 5174,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "for customer happiness the person who",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5176s",
    start: 5176,
    end: 5177,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "invented the metric understood that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5179s",
    start: 5179,
    end: 5180,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "connection five years later",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5183s",
    start: 5183,
    end: 5184,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "it a kind of inertia can set in and you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5187s",
    start: 5187,
    end: 5188,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "forget the truth behind why you were",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5189s",
    start: 5189,
    end: 5190,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "watching that metric in the first place",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5191s",
    start: 5191,
    end: 5192,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "and the world shifts a little yeah and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5194s",
    start: 5194,
    end: 5195,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "now that proxy isn't as valuable as it",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5197s",
    start: 5197,
    end: 5198,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "used to be or it's missing something and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5200s",
    start: 5200,
    end: 5201,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "you have to be on alert for that you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5202s",
    start: 5202,
    end: 5203,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "have to know okay this is I don't really",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5205s",
    start: 5205,
    end: 5206,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "care about this metric I care about",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5207s",
    start: 5207,
    end: 5208,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "care about this metric I care about customer",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5207s",
    start: 5207,
    end: 5209,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "customer",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5208s",
    start: 5208,
    end: 5209,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "happiness and this metric is worth",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5213s",
    start: 5213,
    end: 5214,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "putting energy into and following and",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5215s",
    start: 5215,
    end: 5216,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "improving and scrutinizing only in so",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5219s",
    start: 5219,
    end: 5220,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "much as it actually affects customer",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5222s",
    start: 5222,
    end: 5223,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "happiness and so you got to constantly",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5224s",
    start: 5224,
    end: 5225,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "be on guard and it's very very common",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5226s",
    start: 5226,
    end: 5227,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "this is a nuanced problem it's very",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5229s",
    start: 5229,
    end: 5230,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "common especially in large companies",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5232s",
    start: 5232,
    end: 5233,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that they are managing to metrics that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5234s",
    start: 5234,
    end: 5235,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "they don't really understand they don't",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5237s",
    start: 5237,
    end: 5238,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "really know why they exist and the world",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5239s",
    start: 5239,
    end: 5240,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "may have shifted out from under them a",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5241s",
    start: 5241,
    end: 5242,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "little and the metrics are no longer as",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5243s",
    start: 5243,
    end: 5244,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "relevant as they were when somebody 10",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5246s",
    start: 5246,
    end: 5247,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "years earlier invented the metric that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5249s",
    start: 5249,
    end: 5250,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "is a Nuance but uh that's a big problem",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5253s",
    start: 5253,
    end: 5254,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "right there's something so compelling to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5256s",
    start: 5256,
    end: 5257,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "have a nice metric to try to optimize",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5258s",
    start: 5258,
    end: 5259,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "yes and by the way you do need metrics",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5261s",
    start: 5261,
    end: 5262,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "yes you do you know you can't ignore",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5262s",
    start: 5262,
    end: 5263,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "them um you want them but you just have",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5265s",
    start: 5265,
    end: 5266,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "to be constantly on guard this is you",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5268s",
    start: 5268,
    end: 5269,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "know a a way to slip into day two",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5271s",
    start: 5271,
    end: 5272,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "thinking would be to manage your",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5272s",
    start: 5272,
    end: 5273,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "business to metrics that you don't",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5275s",
    start: 5275,
    end: 5276,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "really understand and you're not really",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5277s",
    start: 5277,
    end: 5278,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "sure why they were invented in the first",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5279s",
    start: 5279,
    end: 5280,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "place and you're not sure they're still",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5280s",
    start: 5280,
    end: 5281,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "as relevant as they used to be uh what",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5283s",
    start: 5283,
    end: 5284,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "does it take to be the guy or gal who",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5285s",
    start: 5285,
    end: 5286,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "who uh who brings up the point that this",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5288s",
    start: 5288,
    end: 5289,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "proxy might be outdated I guess what",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5290s",
    start: 5290,
    end: 5291,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "does it take to have a culture that",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5292s",
    start: 5292,
    end: 5293,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "enables that in the meeting because",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5294s",
    start: 5294,
    end: 5295,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "that's a very uncomfortable thing to",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5296s",
    start: 5296,
    end: 5297,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "bring up at a meeting we all showed up",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5298s",
    start: 5298,
    end: 5299,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "here Friday this is such you have just",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5302s",
    start: 5302,
    end: 5303,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "asked a million-dollar question so th",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5305s",
    start: 5305,
    end: 5306,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "this is this is what you're if I",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5308s",
    start: 5308,
    end: 5309,
  },
  {
    videoTitle: "Lex Fridman Podcast with Jeff Bezos",
    text: "generalize what you're asking you were",

    url: "https://www.youtube.com/watch?v=DcWqzZ3I2cY&t=5311s",
    start: 5311,
    end: 5312,
  },
];

export const unrelatedDataset1: ExampleDataSet<RecommendClipsCustomInput> = {
  profile: {
    name: "experilearning",
    value:
      "@experilearning is a software developer deeply engrossed in the fields of Language Learning Models (LLMs), Spaced Repetition Systems (SRS), and Artificial General Intelligence (AGI). They're actively involved in the development of an app named RemNote and an Open Recommender System. Their interest lies in enhancing learning technologies and building innovative strategies to make learning more engaging through merging social media feed with spaced repetition review. Evident from their tweets, they are enthusiastic about programming mechanisms, error recovery in coding, prompt chains, and other technical aspects related to AI and machine learning. They are advocates for internet freedom, favoring RSS style information dissemination. They are active in discussions about talent constraint, AI safety, and are fond of podcasts like Joe Walker's and Dwarkesh's for fresh perspectives. They constantly share new articles, thoughts, and are part of insightful discussions on platforms like OpenPipeAI, DSPy. They take inspiration from figures like David Deutsch and eagerly await content like @dela3499's video on AGI principles. @experilearning is an active developer with a strong interest in building innovative software solutions, particularly in the areas of advanced 'Language Model' (LLM) technologies and Spaced Repetition Systems (SRS). The user has been working on creating robust data pipelines and handling complex debugging. They devote considerable effort to creating a recommendation system named 'Open Recommender', which leverage LLMs to provide personalized recommendations based on Twitter input. They have a vision of combining learning with the engaging characteristics of binge-watching YouTube shorts. @experilearning is deeply interested in artificial intelligence (AI), machine learning, recommendation systems, and language models. They are building a Spaced Repetition System (SRS) app called RemNote and often communicate with other tech developers like ErikBjare and bryancsk. They have shared resources on creating YouTube recommender systems and predict the resurgence of RSS reader-style internet consumption in conjunction with personalized content recommendation agents. @experilearning is strongly interested in the development and application of LLM (Large Language Models) as evident by his discussions about using fuzzy substring search for citation validation in language tasks. He shares strong opinions about implementing citation validation without LLMs and explains his methodology behind this. His interest extends to developing SRS (spaced repetition software) applications as he mentions building the SRS app @rem_note, tagging other users in his tweet about using fuzzy search to generate citation pins for flashcards within the application. Beyond the technical interests, he seems keen on organizing events, commenting about hosting an Oxford e/acc meetup and getting other users on board for the planning phases. @experilearning's tweets show a deep interest in AI technology, specifically in its application to personalize learning and improve productivity. Experilearning is evidently interested in the latest advancements in Lifelong Learning Machines (LLMs), especially in the context of assistive applications and technology designed to improve productivity. The user has a particular focus on SRS (Spaced Repetition Software) and is actively involved in developing an SRS application known as RemNote. Experilearning demonstrates an affinity for web scraping using Selenium to build browser agents and improve workflow efficiency through innovative approaches. The user is involved in discussions about OpenAI’s RAG (Retrieval Augmented Generation) strategy in their new Assistants Retrieval tool, implying an underlying interest in AI and machine learning. Additionally, tweets and replies indicate Experilearning's clear interest in OpenAI's recent endeavors, including document embedding techniques and vector search. Experilearning shows an interest in tech policies and critiques the UK Government's commitment to being a tech leader. Interactions with other Twitter users also suggest an attraction to applications of multi-modal inputs in AI, using tools like llama.cpp and ModelFusion, even considering potential use cases in fitness and real-time feedback. Exploring the powerful models and their potential applications, the user also expresses curiosity about fine-tuning models like GPT-3.5 to generate code for APIs not in the LLM's training set. The user @experilearning shows a strong interest in artificial intelligence and machine learning, with particular emphasis on Long-Lived Agents (LLM) and Spaced Repetition Systems (SRS). They express concern about AI safety, specifically in the context of massive model training runs and the potential risks they pose, with references to Anthropic CEO's p(doom) probability. They have a strong fascination with knowledge creation, evident in their interactions with posts discussing the endless possibilities of hypothesis generation in human minds. They appear to be heavily involved in coding and web scraping, with mentions of using selenium for web scraping and improving the process with GPT. They also discuss GitHub Copilot and its potential improvements by incorporating type information from compilers. Their interest extends to mathematical creation, citing Henri Poincaré's work, and contributions to the online Remnote community, indicating an interest in collaborative learning and educational content creation. They show admiration of companies with scaled ingredient distribution like hello fresh, hinting at an interest in efficient systems and AI-planned meals. Their comments also suggest an interest in the accessibility of technology, health, and longevity, likening the universality of iPhone ownership to future developments in medicine and longevity.",
  },
  title: {
    name: "lex-bezos",
    value: "Jeff Bezos: Amazon and Blue Origin | Lex Fridman Podcast",
  },
  videoId: {
    name: "lex-bezos",
    value: "DcWqzZ3I2cY",
  },
  tweets: {
    name: "rec-sys-tweets",
    value: tweets,
  },
  transcript: {
    name: "bezos-transcript",
    value: cues,
  },
  user: {
    name: "experilearning",
    value: "experilearning",
  },
  url: {
    name: "lex-bezos",
    value: "https://www.youtube.com/watch?v=DcWqzZ3I2cY",
  },
};
