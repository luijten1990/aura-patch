import { updateCartPromotionsWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { bundlePromotionContext } from "../../lib/bundle-context"

updateCartPromotionsWorkflow.hooks.setPromotionContext(({ cart }) =>
  new StepResponse(bundlePromotionContext(cart))
)
