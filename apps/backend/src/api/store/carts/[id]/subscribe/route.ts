import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { SubscriptionInterval } from "../../../../../modules/subscription/types"
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

  const metadata = (cart?.metadata || {}) as Record<string, unknown>
  let interval = metadata.subscription_interval
  let period = Number(metadata.subscription_period)

  const hasSubscribeItem = Boolean(
    (cart?.items || []).some((item) => {
      const itemMetadata = (item?.metadata || {}) as Record<string, unknown>
      return itemMetadata.purchase_type === "subscription"
    })
  )

  if (
    interval !== SubscriptionInterval.MONTHLY &&
    interval !== SubscriptionInterval.YEARLY &&
    hasSubscribeItem
  ) {
    interval = SubscriptionInterval.MONTHLY
    period = 1
  }

  if (
    interval !== SubscriptionInterval.MONTHLY &&
    interval !== SubscriptionInterval.YEARLY
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "This cart is not set up for a subscription."
    )
  }

  if (!Number.isFinite(period) || period < 1) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "This cart is not set up for a subscription."
    )
  }

  const { result } = await createSubscriptionWorkflow(req.scope).run({
    input: {
      cart_id: req.params.id,
      subscription_data: {
        interval,
        period,
      },
    },
  })

  res.json({
    type: "order",
    order: result.order,
  })
}
