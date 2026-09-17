import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createOrderFulfillmentWorkflow } from "@medusajs/medusa/core-flows"

type OrderItem = {
  id: string
  quantity: number
}

type Order = {
  id: string
  fulfillments?: { id: string }[]
  items?: OrderItem[]
  shipping_address?: { country_code?: string }
  shipping_methods?: {
    shipping_option?: { provider_id?: string }
  }[]
}

/**
 * Creates a label fulfillment for a newly placed order. The selected shipping
 * option and destination must agree: USPS for US addresses, Easyship for all
 * other destinations. Label creation remains explicitly opt-in so a carrier
 * endpoint change cannot begin purchasing labels by itself.
 */
export default async function autoFulfillUspsOrderHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (process.env.AUTO_FULFILL_ON_ORDER_PAID !== "true") {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "items.id",
      "items.quantity",
      "fulfillments.id",
      "shipping_methods.shipping_option.provider_id",
      "shipping_address.country_code",
    ],
    filters: { id: data.id },
  })

  if (!order) {
    logger.error(`Automatic USPS fulfillment skipped: order ${data.id} was not found.`)
    return
  }

  const typedOrder = order as unknown as Order
  if (typedOrder.fulfillments?.length) {
    logger.info(`Automatic USPS fulfillment skipped: order ${typedOrder.id} is already fulfilled.`)
    return
  }

  const countryCode = typedOrder.shipping_address?.country_code?.toLowerCase()
  const providerId = typedOrder.shipping_methods?.[0]?.shipping_option?.provider_id
  const isUspsOrder = countryCode === "us" && providerId === "fp_usps_usps"
  const isEasyshipOrder =
    providerId === "fp_easyship_easyship" || providerId === "easyship_easyship"
  if (!isUspsOrder && !isEasyshipOrder) {
    logger.info(
      `Automatic fulfillment skipped: order ${typedOrder.id} must use USPS or Easyship.`
    )
    return
  }

  const items = (typedOrder.items ?? []).map(({ id, quantity }) => ({ id, quantity }))
  if (!items.length) {
    logger.error(`Automatic USPS fulfillment skipped: order ${typedOrder.id} has no items.`)
    return
  }

  await createOrderFulfillmentWorkflow(container).run({
    input: { order_id: typedOrder.id, items },
  })

  logger.info(`Automatic ${isUspsOrder ? "USPS" : "Easyship"} fulfillment created for order ${typedOrder.id}.`)
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
