import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AFFILIATE_MODULE } from "../modules/affiliate"
import { applyRefund } from "../modules/affiliate/ledger"
import AffiliateModuleService from "../modules/affiliate/service"

export default async function orderCanceledAffiliate({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; order_id?: string; amount?: number }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const affiliates = container.resolve<AffiliateModuleService>(AFFILIATE_MODULE)
  try {
    const orderId = data.order_id || data.id
    const [commission] = await affiliates.listAffiliateCommissions({
      order_id: orderId,
    })
    if (!commission || commission.status === "void") {
      return
    }
    const base = Number(commission.base_amount)
    const rate = base > 0
      ? Math.round((Number(commission.commission_amount) / base) * 100)
      : 20
    const refunded = typeof data.amount === "number" ? data.amount : base
    const next = applyRefund(
      {
        orderId,
        affiliateEmail: "",
        base,
        rate,
        commission: Number(commission.commission_amount),
        status: "pending",
      },
      refunded
    )
    await affiliates.updateAffiliateCommissions({
      id: commission.id,
      base_amount: next.base,
      commission_amount: next.commission,
      status: next.status,
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
