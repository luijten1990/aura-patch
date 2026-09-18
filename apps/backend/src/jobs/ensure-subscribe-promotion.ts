import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ensureSubscribePromotionWorkflow } from "../workflows/ensure-subscribe-promotion"

export default async function ensureSubscribePromotionJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const { result } = await ensureSubscribePromotionWorkflow(container).run()
    const outcome = result as { code?: string }
    logger.info(`Subscribe & Save promotion ready: ${outcome.code}`)
  } catch (error) {
    logger.error(`Unable to ensure SUBSCRIBE20 promotion: ${String(error)}`)
  }
}

export const config = {
  name: "ensure-subscribe-promotion",
  schedule: "*/5 * * * *",
}
