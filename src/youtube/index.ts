import { search } from "./search";
import { download } from "./transcript";

export const yt = {
  search,
  transcript: {
    fetch: download,
  },
};
