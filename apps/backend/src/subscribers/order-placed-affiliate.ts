import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { AFFILIATE_MODULE } from "../modules/affiliate"
import AffiliateModuleService from "../modules/affiliate/service"

type OrderRecord = {
  id: string
  customer_id?: string | null
  currency_code?: string | null
  total?: number | null
  item_subtotal?: number | null
  metadata?: Record<string, unknown> | null
}

export default async function orderPlacedAffiliate({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id", "currency_code", "total", "item_subtotal", "metadata"],
    filters: { id: data.id },
  })

  const typed = order as OrderRecord | undefined
  const code = typed?.metadata?.referral_code
  if (!typed || typeof code !== "string" || !code) {
    return
  }

  const base = Number(typed.item_subtotal ?? typed.total ?? 0)
  const affiliates = container.resolve<AffiliateModuleService>(AFFILIATE_MODULE)
  try {
    await affiliates.recordOrderCommission({
      code,
      orderId: typed.id,
      baseAmount: base,
      currencyCode: typed.currency_code,
    })
    if (typed.customer_id) {
      const customerModule = container.resolve(Modules.CUSTOMER)
      const customer = await customerModule.retrieveCustomer(typed.customer_id)
      const existing = customer.metadata?.referral_code
      if (!existing) {
        await customerModule.updateCustomers(typed.customer_id, {
          metadata: {
            ...(customer.metadata || {}),
            referral_code: code,
          },
        })
      }
    }
  } catch (error) {
    logger.error(
      `Affiliate commission was not recorded for order ${typed.id}: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
