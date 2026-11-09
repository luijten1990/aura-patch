import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AFFILIATE_MODULE } from "../modules/affiliate"
import AffiliateModuleService from "../modules/affiliate/service"

export default async function orderCanceledAffiliate({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const affiliates = container.resolve<AffiliateModuleService>(AFFILIATE_MODULE)
  try {
    const [commission] = await affiliates.listAffiliateCommissions({
      order_id: data.id,
    })
    if (!commission || commission.status === "void") {
      return
    }
    await affiliates.updateAffiliateCommissions({
      id: commission.id,
      status: "void",
    })
  } catch (error) {
    logger.error(
      `Affiliate commission was not voided for order ${data.id}: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    )
  }
}

export const config: SubscriberConfig = {
  event: ["order.canceled", "order.refund_created"],
}
