export interface Summary {
  type: "tweets";
  createdAt: Date;
  data: {
    tweetIds: number[];
    startDate: number;
    endDate: number;
    summary: string;
  };
}
