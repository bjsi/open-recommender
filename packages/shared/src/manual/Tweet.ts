import { z } from "zod";

const CoordinatesSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
});

type Coordinates = z.infer<typeof CoordinatesSchema>;

const PlaceSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  name: z.string(),
  type: z.string(),
  country: z.string(),
  countryCode: z.string(),
});

type Place = z.infer<typeof PlaceSchema>;

const TextLinkSchema = z.object({
  url: z.string(),
  text: z.string().nullish(),
  tcourl: z.string().nullish(),
});

type TextLink = z.infer<typeof TextLinkSchema>;

const UserRefSchema = z.object({
  id: z.number(),
  username: z.string(),
  displayname: z.string(),
  _type: z.literal("snscrape.modules.twitter.UserRef"),
});

type UserRef = z.infer<typeof UserRefSchema>;

export const UserSchema = z.object({
  id: z.number(),
  id_str: z.string(),
  url: z.string(),
  username: z.string(),
  displayname: z.string(),
  rawDescription: z.string(),
  created: z.string(),
  followersCount: z.number(),
  friendsCount: z.number(),
  statusesCount: z.number(),
  favouritesCount: z.number(),
  listedCount: z.number(),
  mediaCount: z.number(),
  location: z.string(),
  profileImageUrl: z.string(),
  profileBannerUrl: z.string().nullish(),
  protected: z.boolean().nullish(),
  verified: z.boolean().nullish(),
  blue: z.boolean().nullish(),
  blueType: z.string().nullish(),
  descriptionLinks: z.array(TextLinkSchema),
  _type: z.literal("snscrape.modules.twitter.User"),
});

type User = z.infer<typeof UserSchema>;

const MediaPhotoSchema = z.object({
  url: z.string(),
});

const MediaAnimatedSchema = z.object({
  thumbnailUrl: z.string(),
  videoUrl: z.string(),
});

const MediaVideoVariantSchema = z.object({
  contentType: z.string(),
  bitrate: z.number(),
});

const MediaVideoSchema = z.object({
  thumbnailUrl: z.string(),
  variants: z.array(MediaVideoVariantSchema),
  duration: z.number(),
  views: z.number().nullish(),
});

type MediaVideo = z.infer<typeof MediaVideoSchema>;

const MediaSchema = z.object({
  photos: z.array(MediaPhotoSchema),
  videos: z.array(MediaVideoSchema),
  animated: z.array(MediaAnimatedSchema),
});

type Media = z.infer<typeof MediaSchema>;

export interface Tweet {
  id: number;
  id_str: string;
  url: string;
  date: string;
  user: User;
  lang: string;
  rawContent: string;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  quoteCount: number;
  conversationId: number;
  hashtags: string[];
  cashtags: string[];
  mentionedUsers: UserRef[];
  links: TextLink[];
  viewCount?: number | null;
  retweetedTweet?: Tweet | null;
  quotedTweet?: Tweet | null;
  replyToTweet?: Tweet | null;
  place?: Place | null;
  coordinates?: Coordinates | null;
  inReplyToTweetId?: number | null;
  inReplyToUser?: UserRef | null;
  source?: string | null;
  sourceUrl?: string | null;
  sourceLabel?: string | null;
  media?: Media | null;
  _type: "snscrape.modules.twitter.Tweet";
}

export const TweetSchema: z.ZodType<Tweet> = z.lazy(() =>
  z.object({
    id: z.number(),
    id_str: z.string(),
    url: z.string(),
    date: z.string(),
    user: UserSchema,
    lang: z.string(),
    rawContent: z.string(),
    replyCount: z.number(),
    retweetCount: z.number(),
    likeCount: z.number(),
    quoteCount: z.number(),
    conversationId: z.number(),
    hashtags: z.array(z.string()),
    cashtags: z.array(z.string()),
    mentionedUsers: z.array(UserRefSchema),
    links: z.array(TextLinkSchema),
    viewCount: z.number().nullish(),
    retweetedTweet: TweetSchema.nullish(),
    quotedTweet: TweetSchema.nullish(),
    replyToTweet: TweetSchema.nullish(),
    place: PlaceSchema.nullish(),
    coordinates: CoordinatesSchema.nullish(),
    inReplyToTweetId: z.number().nullish(),
    inReplyToUser: UserRefSchema.nullish(),
    source: z.string().nullish(),
    sourceUrl: z.string().nullish(),
    sourceLabel: z.string().nullish(),
    media: MediaSchema.nullish(),
    _type: z.literal("snscrape.modules.twitter.Tweet"),
  })
);
