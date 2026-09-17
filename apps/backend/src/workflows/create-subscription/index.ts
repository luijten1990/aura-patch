import {
  createWorkflow,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  acquireLockStep,
  completeCartWorkflow,
  createRemoteLinkStep,
  releaseLockStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import subscriptionOrderLink from "../../links/subscription-order"
import { SubscriptionInterval } from "../../modules/subscription/types"
import fulfillSubscriptionOrderStep from "../create-subscription-order/steps/fulfill-subscription-order"
import createSubscriptionStep from "./steps/create-subscription"

type WorkflowInput = {
  cart_id: string
  subscription_data: {
    interval: SubscriptionInterval
    period: number
  }
}

const createSubscriptionWorkflow = createWorkflow(
  "create-subscription",
  (input: WorkflowInput) => {
    acquireLockStep({
      key: input.cart_id,
      timeout: 2,
      ttl: 10,
    })

    const { id } = completeCartWorkflow.runAsStep({
      input: {
        id: input.cart_id,
      },
    })

    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "customer_id",
        "email",
        "currency_code",
        "region_id",
        "sales_channel_id",
        "total",
        "shipping_address.*",
        "billing_address.*",
        "items.title",
        "items.subtitle",
        "items.thumbnail",
        "items.variant_id",
        "items.product_id",
        "items.quantity",
        "items.unit_price",
        "items.metadata",
        "shipping_methods.name",
        "shipping_methods.amount",
        "shipping_methods.is_tax_inclusive",
        "shipping_methods.shipping_option_id",
        "shipping_methods.data",
      ],
      filters: {
        id,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    })

    const { data: existingLinks } = useQueryGraphStep({
      entity: subscriptionOrderLink.entryPoint,
      fields: ["subscription.id"],
      filters: { order_id: orders[0].id },
    }).config({ name: "retrieve-existing-links" })

    const subscription = when(
      "create-subscription-condition",
      { existingLinks },
      (data) => !data.existingLinks?.length
    ).then(() => {
      const { subscription, linkDefs } = createSubscriptionStep({
        order_id: orders[0].id,
        customer_id: orders[0].customer_id!,
        subscription_data: input.subscription_data,
      })

      createRemoteLinkStep(linkDefs)

      return subscription
    })

    fulfillSubscriptionOrderStep({
      order_id: orders[0].id,
    })

    releaseLockStep({
      key: input.cart_id,
    })

    return new WorkflowResponse({
      subscription,
      order: orders[0],
    })
  }
)

export default createSubscriptionWorkflow
