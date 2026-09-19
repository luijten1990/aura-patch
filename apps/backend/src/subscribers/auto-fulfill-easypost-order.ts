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
  shipping_methods?: {
    shipping_option?: { provider_id?: string }
  }[]
}

/**
 * Creates an EasyPost label fulfillment for a newly placed order. Label
 * creation remains explicitly opt-in so a carrier endpoint change cannot
 * begin purchasing labels by itself.
 */
export default async function autoFulfillEasypostOrderHandler({
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
    ],
    filters: { id: data.id },
  })

  if (!order) {
    logger.error(`Automatic EasyPost fulfillment skipped: order ${data.id} was not found.`)
    return
  }

  const typedOrder = order as unknown as Order
  if (typedOrder.fulfillments?.length) {
    logger.info(`Automatic EasyPost fulfillment skipped: order ${typedOrder.id} is already fulfilled.`)
    return
  }

  const providerId = typedOrder.shipping_methods?.[0]?.shipping_option?.provider_id
  if (providerId !== "fp_easypost_easypost") {
    logger.info(
      `Automatic fulfillment skipped: order ${typedOrder.id} must use EasyPost.`
    )
    return
  }

  const items = (typedOrder.items ?? []).map(({ id, quantity }) => ({ id, quantity }))
  if (!items.length) {
    logger.error(`Automatic EasyPost fulfillment skipped: order ${typedOrder.id} has no items.`)
    return
  }

  await createOrderFulfillmentWorkflow(container).run({
    input: { order_id: typedOrder.id, items },
  })

  logger.info(`Automatic EasyPost fulfillment created for order ${typedOrder.id}.`)
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
