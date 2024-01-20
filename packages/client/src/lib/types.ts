import { z } from "zod";
import { UserModel } from "shared/src/schemas/user";

export interface Authenticated {
  authenticated: true;
  user: z.infer<typeof UserModel>;
}

export type AuthInfo =
  | Authenticated
  | {
      authenticated: false;
      error: string;
    };
