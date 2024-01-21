import { z } from "zod";
import { UserModel } from "../schemas";

export const PublicUserModel = UserModel.omit({
  email: true,
  id: true,
  updatedAt: true,
  twitterId: true,
  apiKey: true,
}).merge(z.object({ createdAt: z.date().transform((d) => d.toISOString()) }));

export type PublicUser = z.infer<typeof PublicUserModel>;
