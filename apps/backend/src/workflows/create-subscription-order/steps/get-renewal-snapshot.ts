import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_MODULE } from "../../../modules/subscription"
import { readRenewalSnapshot } from "../../../modules/subscription/renewal-snapshot"
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
    const snapshot = readRenewalSnapshot(
      subscription.metadata as Record<string, unknown> | null
    )

    if (!snapshot) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "This subscription is missing the snapshot needed to place a renewal order."
      )
    }

    return new StepResponse(snapshot)
  }
)

export default getRenewalSnapshotStep
