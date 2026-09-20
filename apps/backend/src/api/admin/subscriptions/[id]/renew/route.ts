import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import createSubscriptionOrderWorkflow from "../../../../../workflows/create-subscription-order"
import { SUBSCRIPTION_MODULE } from "../../../../../modules/subscription"
import SubscriptionModuleService from "../../../../../modules/subscription/service"

type RenewBody = {
  force?: boolean
}

export const POST = async (
  req: AuthenticatedMedusaRequest<RenewBody>,
  res: MedusaResponse
) => {
  const subscriptionModuleService: SubscriptionModuleService =
    req.scope.resolve(SUBSCRIPTION_MODULE)
  const subscription = await subscriptionModuleService.retrieveSubscription(
    req.params.id
  )

  if (!subscription) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "That subscription was not found."
    )
  }

  const force = Boolean(req.body?.force)
  const due =
    subscription.next_order_date &&
    new Date(subscription.next_order_date).getTime() <= Date.now()

  if (!force && !due) {
    res.status(409).json({
      message:
        "This subscription is not due yet. Pass { \"force\": true } to place a test renewal.",
      next_order_date: subscription.next_order_date,
    })
    return
  }

  const { result } = await createSubscriptionOrderWorkflow(req.scope).run({
    input: { subscription },
  })

  res.json({
    order: result.order,
    subscription_id: subscription.id,
  })
}
