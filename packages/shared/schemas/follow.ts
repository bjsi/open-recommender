import * as z from "zod"
import { FollowType } from "@prisma/client"
import { CompleteUser, RelatedUserModel } from "./index"

export const FollowModel = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  followId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  followType: z.nativeEnum(FollowType),
})

export interface CompleteFollow extends z.infer<typeof FollowModel> {
  user: CompleteUser
  follow: CompleteUser
}

/**
 * RelatedFollowModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFollowModel: z.ZodSchema<CompleteFollow> = z.lazy(() => FollowModel.extend({
  user: RelatedUserModel,
  follow: RelatedUserModel,
}))
