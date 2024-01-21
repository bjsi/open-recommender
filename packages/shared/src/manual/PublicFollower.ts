import { z } from "zod";
import { FollowModel } from "../schemas";

export const PublicFollowerModel = FollowModel.omit({
  id: true,
  userId: true,
  followId: true,
  updatedAt: true,
});

export type PublicFollower = z.infer<typeof PublicFollowerModel>;
