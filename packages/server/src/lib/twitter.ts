import { initTwitterAPI, TwitterAPI } from "cli/src/twitter/twitterAPI";

let twitterAPISingleton: TwitterAPI;

export const getTwitterAPISingleton = () => {
  if (!twitterAPISingleton) {
    twitterAPISingleton = initTwitterAPI().api;
  }
  return twitterAPISingleton;
};
