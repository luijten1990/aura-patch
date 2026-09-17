import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { SUBSCRIPTION_MODULE } from "../../../../../../modules/subscription"
import SubscriptionModuleService from "../../../../../../modules/subscription/service"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [customer] } = await query.graph({
    entity: "customer",
    fields: ["subscriptions.id"],
    filters: {
      id: req.auth_context.actor_id,
    },
  })

  const ownsSubscription = (
    (customer as { subscriptions?: Array<{ id?: string } | null> | null } | undefined)
      ?.subscriptions || []
  ).some((subscription) => subscription?.id === req.params.id)

  if (!ownsSubscription) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You can only cancel your own subscriptions."
    )
  }

  const subscriptionModuleService: SubscriptionModuleService =
    req.scope.resolve(SUBSCRIPTION_MODULE)

  const subscription = await subscriptionModuleService.cancelSubscriptions(
    req.params.id
  )

  res.json({
    subscription,
  })
}
