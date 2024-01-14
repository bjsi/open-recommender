import { User } from "shared/types/user";

export interface Authenticated {
  authenticated: true;
  user: User;
}

export type AuthInfo =
  | Authenticated
  | {
      authenticated: false;
      error: string;
    };
