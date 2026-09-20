import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { resolveCartSubscription } from "../../../../../lib/resolve-cart-subscription"
import createSubscriptionWorkflow from "../../../../../workflows/create-subscription"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [cart] } = await query.graph({
    entity: "cart",
    fields: ["id", "metadata", "items.metadata"],
    filters: {
      id: req.params.id,
    },
  })

  const subscription = resolveCartSubscription(cart)

  if (!subscription.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "This cart is not set up for a subscription."
    )
  }

  const { result } = await createSubscriptionWorkflow(req.scope).run({
    input: {
      cart_id: req.params.id,
      subscription_data: {
        interval: subscription.interval,
        period: subscription.period,
      },
    },
  })

  res.json({
    type: "order",
    order: result.order,
  })
}
