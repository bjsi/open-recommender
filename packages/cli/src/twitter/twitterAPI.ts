import { PyBridge, RemoteController } from "pybridge-zod";
import { z } from "zod";

export const TwitterAPISchema = z.object({
  get_tweets_since: z.function(
    z.tuple([z.string(), z.number(), z.number()]),
    z.string()
  ),
  get_tweets: z.function(z.tuple([z.string(), z.number()]), z.string()),
  get_user: z.function(z.tuple([z.string()]), z.string()),
  get_tweet: z.function(z.tuple([z.number()]), z.string()),
});

export type TwitterAPI = RemoteController<z.infer<typeof TwitterAPISchema>>;

class PythonController {
  api: TwitterAPI;

  constructor(protected python: PyBridge) {
    this.python = python;
    this.api = this.python.controller("twitterAPI.py", TwitterAPISchema);
  }
}

export const initTwitterAPI = () => {
  const bridge = new PyBridge({
    python: "python3",
    cwd: __dirname,
  });
  return {
    api: new PythonController(bridge).api,
    bridge,
  };
};
