import { LinkDefinition } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_MODULE } from "../../../modules/subscription"
import {
  buildRenewalSnapshot,
  RENEWAL_SNAPSHOT_KEY,
} from "../../../modules/subscription/renewal-snapshot"
import SubscriptionModuleService from "../../../modules/subscription/service"
import { SubscriptionInterval } from "../../../modules/subscription/types"

type StepInput = {
  order_id: string
  customer_id?: string
  subscription_data: {
    interval: SubscriptionInterval
    period: number
  }
}

const createSubscriptionStep = createStep(
  "create-subscription",
  async ({
    order_id,
    customer_id,
    subscription_data,
  }: StepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: [order] } = await query.graph({
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
        id: order_id,
      },
    })

    const subscriptionModuleService: SubscriptionModuleService =
      container.resolve(SUBSCRIPTION_MODULE)
    const linkDefs: LinkDefinition[] = []

    const subscription = await subscriptionModuleService.createSubscriptionWithDates({
      ...subscription_data,
      metadata: {
        main_order_id: order_id,
        [RENEWAL_SNAPSHOT_KEY]: buildRenewalSnapshot(
          (order || {}) as Record<string, unknown>
        ),
      },
    })

    linkDefs.push({
      [SUBSCRIPTION_MODULE]: {
        subscription_id: subscription.id,
      },
      [Modules.ORDER]: {
        order_id,
      },
    })

    if (customer_id) {
      linkDefs.push({
        [SUBSCRIPTION_MODULE]: {
          subscription_id: subscription.id,
        },
        [Modules.CUSTOMER]: {
          customer_id,
        },
      })
    }

    return new StepResponse({
      subscription,
      linkDefs,
    }, {
      subscription,
    })
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const subscriptionModuleService: SubscriptionModuleService =
      container.resolve(SUBSCRIPTION_MODULE)

    await subscriptionModuleService.cancelSubscriptions(data.subscription.id)
  }
)

export default createSubscriptionStep
