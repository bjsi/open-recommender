import { PyBridge, RemoteController } from "pybridge";

export interface TwitterAPI {
  get_user_info(user_login: string): Promise<string>; // Tweet[];
}

class PythonController {
  api: RemoteController<TwitterAPI>;

  constructor(protected python: PyBridge) {
    this.python = python;
    this.api = this.python.controller<TwitterAPI>("twitter.py");
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
