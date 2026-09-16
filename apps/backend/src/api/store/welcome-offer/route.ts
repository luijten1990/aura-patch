import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { z } from "@medusajs/framework/zod"
import { sendWelcomeOfferWorkflow } from "../../../workflows/send-welcome-offer"
import { PostStoreWelcomeOfferSchema } from "./validators"

type PostStoreWelcomeOffer = z.infer<typeof PostStoreWelcomeOfferSchema>

export const POST = async (
  req: MedusaRequest<PostStoreWelcomeOffer>,
  res: MedusaResponse
) => {
  const { email } = req.validatedBody

  const { result } = await sendWelcomeOfferWorkflow(req.scope).run({
    input: { email },
  })

  res.json({
    ok: true,
    code: result.code,
  })
}
