import { z } from "@medusajs/framework/zod"

export const PostStoreWelcomeOfferSchema = z.object({
  email: z.string().email(),
})
