import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ensureBundlePromotionsWorkflow } from "../workflows/ensure-bundle-promotions"

export default async function ensureBundlePromotionsJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const { result } = await ensureBundlePromotionsWorkflow(container).run()
    const outcome = result as { created?: string[]; updated?: string[] }
    const created = (outcome.created || []).join(", ") || "none"
    const updated = (outcome.updated || []).join(", ") || "none"
    logger.info(`Bundle promotions ready. Created: ${created}. Updated: ${updated}.`)
  } catch (error) {
    logger.error(`Unable to ensure bundle promotions: ${String(error)}`)
  }
}

export const config = {
  name: "ensure-bundle-promotions",
  schedule: "*/5 * * * *",
}
