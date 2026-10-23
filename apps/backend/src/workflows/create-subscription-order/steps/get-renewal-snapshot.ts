import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_MODULE } from "../../../modules/subscription"
import {
  buildRenewalSnapshot,
  readRenewalSnapshot,
  RENEWAL_ORDER_FIELDS,
  RENEWAL_SNAPSHOT_KEY,
  renewalSnapshotMissingPrices,
} from "../../../modules/subscription/renewal-snapshot"
import SubscriptionModuleService from "../../../modules/subscription/service"

type StepInput = {
  subscription_id: string
}

const getRenewalSnapshotStep = createStep(
  "get-renewal-snapshot",
  async ({ subscription_id }: StepInput, { container }) => {
    const subscriptionModuleService: SubscriptionModuleService =
      container.resolve(SUBSCRIPTION_MODULE)
    const subscription = await subscriptionModuleService.retrieveSubscription(
      subscription_id
    )
    const metadata = (subscription.metadata || {}) as Record<string, unknown>
    let snapshot = readRenewalSnapshot(metadata)

    if (!snapshot) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "This subscription is missing the snapshot needed to place a renewal order."
      )
    }

    const orderId = typeof metadata.main_order_id === "string"
      ? metadata.main_order_id
      : undefined

    if (renewalSnapshotMissingPrices(snapshot) && orderId) {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { data: [order] } = await query.graph({
        entity: "order",
        fields: [...RENEWAL_ORDER_FIELDS],
        filters: {
          id: orderId,
        },
      })
      const rebuilt = order
        ? buildRenewalSnapshot(order as Record<string, unknown>)
        : null

      if (rebuilt && !renewalSnapshotMissingPrices(rebuilt)) {
        await subscriptionModuleService.updateSubscriptions({
          id: subscription_id,
          metadata: {
            ...metadata,
            [RENEWAL_SNAPSHOT_KEY]: rebuilt,
          },
        })
        snapshot = rebuilt
      }
    }

    return new StepResponse(snapshot)
  }
)

export default getRenewalSnapshotStep
