import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { RecommendClipsCustomInput } from "../schemas/recommendClipsInputSchema";
import { Tweet } from "../../../../twitter/schemas";
import { TranscriptCue } from "../../../../youtube/transcript";

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
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=0s",
    start: 0,
    end: 16,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=15s",
    start: 15,
    end: 16,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "hello and welcome to another episode of",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=17s",
    start: 17,
    end: 18,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "let's argue about plants the podcast for",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=20s",
    start: 20,
    end: 21,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "people who love plants but not always",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=23s",
    start: 23,
    end: 24,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "the same ones I'm Carol Collins I'm",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=25s",
    start: 25,
    end: 26,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "associate editor at fine gardening",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=27s",
    start: 27,
    end: 28,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "magazine and I'm Danielle Shar I'm the",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=30s",
    start: 30,
    end: 31,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "executive editor hey Carol Happy",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=33s",
    start: 33,
    end: 34,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "official fall how you doing I am much",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=36s",
    start: 36,
    end: 37,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "cooler now that the fall weather is",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=38s",
    start: 38,
    end: 39,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "setting in right we had like a a fall",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=42s",
    start: 42,
    end: 43,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "start to fall I think here in New",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=44s",
    start: 44,
    end: 45,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "England this year folks it was uh 90",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=47s",
    start: 47,
    end: 48,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "degrees uh we actually did hit 90 there",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=50s",
    start: 50,
    end: 51,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "were some record-breaking temperatures",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=52s",
    start: 52,
    end: 53,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "it was humid as Florida and yeah it made",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=55s",
    start: 55,
    end: 56,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "me really truly appreciate this morning",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=58s",
    start: 58,
    end: 59,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "waking up to the first fall weather that",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=60s",
    start: 60,
    end: 61,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "we've really had like a nice cool 60 and",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=64s",
    start: 64,
    end: 65,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "dry this is why we live here this is why",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=66s",
    start: 66,
    end: 67,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "we live here but with that being said we",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=70s",
    start: 70,
    end: 71,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "decided to we've delved into fall a",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=73s",
    start: 73,
    end: 74,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "little bit so far this season but Carol",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=75s",
    start: 75,
    end: 76,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "what's our topic today we're GNA talk",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=79s",
    start: 79,
    end: 80,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "about plant this with that fall Edition",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=82s",
    start: 82,
    end: 83,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "so what you know combos of plants that",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=85s",
    start: 85,
    end: 86,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "look great together at the end of the",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=87s",
    start: 87,
    end: 88,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "season like now yes y love it I love it",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=91s",
    start: 91,
    end: 92,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "I love it um truth be told how I got par",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=94s",
    start: 94,
    end: 95,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "for this is I walked around my garden",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=97s",
    start: 97,
    end: 98,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "I'm like oh you look good with you all",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=99s",
    start: 99,
    end: 100,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "right let's take a picture and I'm gonna",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=100s",
    start: 100,
    end: 101,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "talk about that one so I will say",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=104s",
    start: 104,
    end: 105,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "disclosure these aren't like you know",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=106s",
    start: 106,
    end: 107,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "the most groundbreaking combinations but",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=108s",
    start: 108,
    end: 109,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "it's what was like truly inspiring me in",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=111s",
    start: 111,
    end: 112,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "my garden right now yes and I must admit",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=115s",
    start: 115,
    end: 116,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "that my I switched it up a little maybe",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=118s",
    start: 118,
    end: 119,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "since the last time you saw the lineup",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=120s",
    start: 120,
    end: 121,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "but I was inspired by one of your",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=123s",
    start: 123,
    end: 124,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "combinations so we'll we'll get to that",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=124s",
    start: 124,
    end: 125,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "later in the show but yes I I I also did",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=128s",
    start: 128,
    end: 129,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "a walkabout for inspiration same thing I",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=131s",
    start: 131,
    end: 132,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "I had a feeling because if you're",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=133s",
    start: 133,
    end: 134,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "watching this on YouTube which you can",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=135s",
    start: 135,
    end: 136,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "watch this podcast as opposed to listen",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=138s",
    start: 138,
    end: 139,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "only to this podcast on YouTube if you",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=140s",
    start: 140,
    end: 141,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "go to the Fine gardening YouTube channel",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=142s",
    start: 142,
    end: 143,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "you can see Carol and I in all of our",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=144s",
    start: 144,
    end: 145,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "early morning recording Glory but Carol",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=147s",
    start: 147,
    end: 148,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "always has generally a vase behind her",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=151s",
    start: 151,
    end: 152,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "in her office where the plants that are",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=154s",
    start: 154,
    end: 155,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "in the vase often times are a preview of",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=158s",
    start: 158,
    end: 159,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "what Carol is going to talk about and I",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=160s",
    start: 160,
    end: 161,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "spy with my little eye a plant back",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=163s",
    start: 163,
    end: 164,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "there that I know I'm gonna talk about",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=165s",
    start: 165,
    end: 166,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "so I have a feeling I know how you mixed",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=167s",
    start: 167,
    end: 168,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "it up that is it we usually try to avoid",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=171s",
    start: 171,
    end: 172,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "talking about the same plants but I",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=173s",
    start: 173,
    end: 174,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "thought this might be fun to you know",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=175s",
    start: 175,
    end: 176,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "combos that play off a different a plant",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=178s",
    start: 178,
    end: 179,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "with a different take on the same",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=180s",
    start: 180,
    end: 181,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "absolutely absolutely well I won't force",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=183s",
    start: 183,
    end: 184,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "your hand to talk about that particular",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=185s",
    start: 185,
    end: 186,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "plant but what is your first combo plant",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=189s",
    start: 189,
    end: 190,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "this with that the fall Edition so this",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=192s",
    start: 192,
    end: 193,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "one is a kind of a classic Cottage",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=195s",
    start: 195,
    end: 196,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "Garden combo what I have is white drift",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=198s",
    start: 198,
    end: 199,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "Rose that's Rosa",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=200s",
    start: 200,
    end: 201,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "myerland um with tall Garden flocks and",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=204s",
    start: 204,
    end: 205,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "that's flocks",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=206s",
    start: 206,
    end: 207,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "panicula I do not know the cultivar of",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=209s",
    start: 209,
    end: 210,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "my flocks I do not I the the it's a",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=213s",
    start: 213,
    end: 214,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "mystery the tag is lost to the sands of",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=216s",
    start: 216,
    end: 217,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "time but um tall Garden flocks is Hardy",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=220s",
    start: 220,
    end: 221,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "from zones 4 to eight the white drift",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=223s",
    start: 223,
    end: 224,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "row zones 4 to 11 so this a super cold",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=226s",
    start: 226,
    end: 227,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "hearty combo the white drift Rose is",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=230s",
    start: 230,
    end: 231,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "considered a landscape Rose and or a",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=233s",
    start: 233,
    end: 234,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "ground cover Rose and so it grows like 2",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=237s",
    start: 237,
    end: 238,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "feet tall 3 feet wide uh like SP Sun",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=241s",
    start: 241,
    end: 242,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "Rich well- drained soil you know it's",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=243s",
    start: 243,
    end: 244,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "you know it's a rose but it's pretty",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=245s",
    start: 245,
    end: 246,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "trouble-free it it stays disease-free",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=248s",
    start: 248,
    end: 249,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "throughout the summer and unlike some of",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=251s",
    start: 251,
    end: 252,
  },
  {
    videoTitle: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
    text: "the other roses that maybe you know your",

    url: "https://www.youtube.com/watch?v=XrjcDKCisEI&t=253s",
    start: 253,
    end: 254,
  },
];

/**
 * Sanity check to make sure the prompt doesn't always recommend clips.
 * This example takes my tweets about recommendation systems and compares them to a podcast about plants.
 */
export const unrelatedDataset2: ExampleDataSet<RecommendClipsCustomInput> = {
  videoId: {
    name: "plants-pod",
    value: "XrjcDKCisEI",
  },
  user: {
    name: "experilearning",
    value: "experilearning",
  },
  url: {
    name: "plants-pod",
    value: "https://www.youtube.com/watch?v=XrjcDKCisEI",
  },
  title: {
    name: "plants-pod",
    value: "Episode 144: Plant This with That-Fall Edition",
  },
  tweets: {
    name: "rec-sys-tweets",
    value: tweets,
  },
  transcript: {
    name: "plants-pod",
    value: cues,
  },
  profile: {
    name: "experilearning",
    value:
      "@experilearning is a software developer deeply engrossed in the fields of Language Learning Models (LLMs), Spaced Repetition Systems (SRS), and Artificial General Intelligence (AGI). They're actively involved in the development of an app named RemNote and an Open Recommender System. Their interest lies in enhancing learning technologies and building innovative strategies to make learning more engaging through merging social media feed with spaced repetition review. Evident from their tweets, they are enthusiastic about programming mechanisms, error recovery in coding, prompt chains, and other technical aspects related to AI and machine learning. They are advocates for internet freedom, favoring RSS style information dissemination. They are active in discussions about talent constraint, AI safety, and are fond of podcasts like Joe Walker's and Dwarkesh's for fresh perspectives. They constantly share new articles, thoughts, and are part of insightful discussions on platforms like OpenPipeAI, DSPy. They take inspiration from figures like David Deutsch and eagerly await content like @dela3499's video on AGI principles. @experilearning is an active developer with a strong interest in building innovative software solutions, particularly in the areas of advanced 'Language Model' (LLM) technologies and Spaced Repetition Systems (SRS). The user has been working on creating robust data pipelines and handling complex debugging. They devote considerable effort to creating a recommendation system named 'Open Recommender', which leverage LLMs to provide personalized recommendations based on Twitter input. They have a vision of combining learning with the engaging characteristics of binge-watching YouTube shorts. @experilearning is deeply interested in artificial intelligence (AI), machine learning, recommendation systems, and language models. They are building a Spaced Repetition System (SRS) app called RemNote and often communicate with other tech developers like ErikBjare and bryancsk. They have shared resources on creating YouTube recommender systems and predict the resurgence of RSS reader-style internet consumption in conjunction with personalized content recommendation agents. @experilearning is strongly interested in the development and application of LLM (Large Language Models) as evident by his discussions about using fuzzy substring search for citation validation in language tasks. He shares strong opinions about implementing citation validation without LLMs and explains his methodology behind this. His interest extends to developing SRS (spaced repetition software) applications as he mentions building the SRS app @rem_note, tagging other users in his tweet about using fuzzy search to generate citation pins for flashcards within the application. Beyond the technical interests, he seems keen on organizing events, commenting about hosting an Oxford e/acc meetup and getting other users on board for the planning phases. @experilearning's tweets show a deep interest in AI technology, specifically in its application to personalize learning and improve productivity. Experilearning is evidently interested in the latest advancements in Lifelong Learning Machines (LLMs), especially in the context of assistive applications and technology designed to improve productivity. The user has a particular focus on SRS (Spaced Repetition Software) and is actively involved in developing an SRS application known as RemNote. Experilearning demonstrates an affinity for web scraping using Selenium to build browser agents and improve workflow efficiency through innovative approaches. The user is involved in discussions about OpenAI’s RAG (Retrieval Augmented Generation) strategy in their new Assistants Retrieval tool, implying an underlying interest in AI and machine learning. Additionally, tweets and replies indicate Experilearning's clear interest in OpenAI's recent endeavors, including document embedding techniques and vector search. Experilearning shows an interest in tech policies and critiques the UK Government's commitment to being a tech leader. Interactions with other Twitter users also suggest an attraction to applications of multi-modal inputs in AI, using tools like llama.cpp and ModelFusion, even considering potential use cases in fitness and real-time feedback. Exploring the powerful models and their potential applications, the user also expresses curiosity about fine-tuning models like GPT-3.5 to generate code for APIs not in the LLM's training set. The user @experilearning shows a strong interest in artificial intelligence and machine learning, with particular emphasis on Long-Lived Agents (LLM) and Spaced Repetition Systems (SRS). They express concern about AI safety, specifically in the context of massive model training runs and the potential risks they pose, with references to Anthropic CEO's p(doom) probability. They have a strong fascination with knowledge creation, evident in their interactions with posts discussing the endless possibilities of hypothesis generation in human minds. They appear to be heavily involved in coding and web scraping, with mentions of using selenium for web scraping and improving the process with GPT. They also discuss GitHub Copilot and its potential improvements by incorporating type information from compilers. Their interest extends to mathematical creation, citing Henri Poincaré's work, and contributions to the online Remnote community, indicating an interest in collaborative learning and educational content creation. They show admiration of companies with scaled ingredient distribution like hello fresh, hinting at an interest in efficient systems and AI-planned meals. Their comments also suggest an interest in the accessibility of technology, health, and longevity, likening the universality of iPhone ownership to future developments in medicine and longevity.",
  },
};
