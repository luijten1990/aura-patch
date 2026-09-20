import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  ensureEasyPostShippingWorkflow,
  EnsureEasyPostResult,
} from "../workflows/ensure-easypost-shipping"

export default async function ensureEasyPostShippingJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const { result } = await ensureEasyPostShippingWorkflow(container).run()
    const outcome = result as EnsureEasyPostResult
    logger.info(
      `EasyPost shipping ready (removed: ${outcome.removed_ids.length}, created: ${outcome.created_option_ids.length}, linked locations: ${outcome.linked_locations})`
    )
  } catch (error) {
    logger.error(`Unable to ensure EasyPost shipping: ${String(error)}`)
  }
}

export const config = {
  name: "ensure-easypost-shipping-restore-intl",
  schedule: "* * * * *",
  numberOfExecutions: 12,
}
