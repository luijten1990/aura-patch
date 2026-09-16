import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ensureWelcomeOfferWorkflow } from "../workflows/send-welcome-offer"

export default async function ensureIloveauraPromotionJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const { result } = await ensureWelcomeOfferWorkflow(container).run()
    logger.info(`Welcome offer promotion ready: ${result.code}`)
  } catch (error) {
    logger.error(`Unable to ensure ILOVEAURA promotion: ${String(error)}`)
  }
}

export const config = {
  name: "ensure-iloveaura-promotion",
  schedule: "* * * * *",
  numberOfExecutions: 8,
}
