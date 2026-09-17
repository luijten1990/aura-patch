import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { createOrderFulfillmentWorkflow } from "@medusajs/medusa/core-flows"

type StepInput = {
  order_id: string
}

const fulfillSubscriptionOrderStep = createStep(
  "fulfill-subscription-order",
  async ({ order_id }: StepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "items.id",
        "items.quantity",
        "fulfillments.id",
      ],
      filters: {
        id: order_id,
      },
    })

    const typedOrder = order as {
      id?: string
      items?: { id?: string; quantity?: number }[]
      fulfillments?: { id?: string }[]
    } | undefined

    if (!typedOrder?.id) {
      return new StepResponse({ fulfilled: false })
    }

    if (typedOrder.fulfillments?.length) {
      return new StepResponse({ fulfilled: false })
    }

    const items = (typedOrder.items || [])
      .filter((item) => item.id)
      .map((item) => ({
        id: item.id as string,
        quantity: item.quantity || 1,
      }))

    if (!items.length) {
      return new StepResponse({ fulfilled: false })
    }

    try {
      await createOrderFulfillmentWorkflow(container).run({
        input: {
          order_id: typedOrder.id,
          items,
        },
      })
      logger.info(`Bought a shipping label for subscription order ${typedOrder.id}`)
      return new StepResponse({ fulfilled: true })
    } catch (error) {
      logger.error(
        `Unable to buy a shipping label for subscription order ${typedOrder.id}: ${String(error)}`
      )
      return new StepResponse({ fulfilled: false })
    }
  }
)

export default fulfillSubscriptionOrderStep
