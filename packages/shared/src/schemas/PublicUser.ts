import { z } from "zod";
import { UserModel } from "./user";

export const PublicUserModel = UserModel.omit({
  email: true,
  id: true,
  updatedAt: true,
  twitterId: true,
  name: true,
});

export type PublicUser = z.infer<typeof PublicUserModel>;
