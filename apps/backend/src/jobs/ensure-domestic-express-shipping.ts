import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ensureDomesticExpressShippingWorkflow } from "../workflows/ensure-domestic-express-shipping"

export default async function ensureDomesticExpressShippingJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const { result } = await ensureDomesticExpressShippingWorkflow(container).run()
    logger.info(
      `Domestic Express Shipping ready (${result.created ? "created" : result.updated ? "updated" : "already present"}): ${result.name}`
    )
  } catch (error) {
    logger.error(`Unable to ensure domestic Express Shipping: ${String(error)}`)
  }
}

export const config = {
  name: "ensure-domestic-express-easyship",
  schedule: "* * * * *",
  numberOfExecutions: 8,
}
