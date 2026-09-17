import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  ensureDomesticExpressShippingWorkflow,
  EnsureResult,
} from "../workflows/ensure-domestic-express-shipping"

export default async function ensureDomesticExpressShippingJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const { result } = await ensureDomesticExpressShippingWorkflow(container).run()
    const outcome = result as EnsureResult
    logger.info(
      `Domestic Express Shipping ready (${outcome.created ? "created" : outcome.updated ? "updated" : "already present"}): ${outcome.name}`
    )
  } catch (error) {
    logger.error(`Unable to ensure domestic Express Shipping: ${String(error)}`)
  }
}

export const config = {
  name: "ensure-domestic-express-us-zone",
  schedule: "* * * * *",
  numberOfExecutions: 12,
}
