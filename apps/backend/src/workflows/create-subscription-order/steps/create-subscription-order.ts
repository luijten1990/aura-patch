import { LinkDefinition, PaymentCollectionDTO } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { createOrderWorkflow } from "@medusajs/medusa/core-flows"
import { SUBSCRIPTION_MODULE } from "../../../modules/subscription"
import { SubscriptionRenewalSnapshot } from "../../../modules/subscription/renewal-snapshot"
import { SubscriptionData } from "../../../modules/subscription/types"

export type CreateSubscriptionOrderStepInput = {
  subscription: SubscriptionData
  snapshot: SubscriptionRenewalSnapshot
  payment_collection: PaymentCollectionDTO
}

const getOrderData = (snapshot: SubscriptionRenewalSnapshot) => ({
  region_id: snapshot.region_id,
  customer_id: snapshot.customer_id,
  sales_channel_id: snapshot.sales_channel_id,
  email: snapshot.email,
  currency_code: snapshot.currency_code,
  shipping_address: snapshot.shipping_address,
  billing_address: snapshot.billing_address,
  items: snapshot.items.map((item) => ({
    title: item.title || "Aura Patch",
    subtitle: item.subtitle,
    thumbnail: item.thumbnail,
    variant_id: item.variant_id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    metadata: item.metadata,
  })),
  shipping_methods: snapshot.shipping_methods.map((method) => ({
    name: method.name,
    amount: method.amount,
    is_tax_inclusive: method.is_tax_inclusive,
    shipping_option_id: method.shipping_option_id,
    data: method.data,
  })),
})

const createSubscriptionOrderStep = createStep(
  "create-subscription-order",
  async ({
    subscription,
    snapshot,
    payment_collection,
  }: CreateSubscriptionOrderStepInput, { container, context }) => {
    if (!snapshot.items.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "This subscription is missing the items needed to place a renewal order."
      )
    }

    const linkDefs: LinkDefinition[] = []
    const { result: order } = await createOrderWorkflow(container).run({
      input: getOrderData(snapshot),
      context,
    })

    linkDefs.push(
      {
        [Modules.ORDER]: {
          order_id: order.id,
        },
        [Modules.PAYMENT]: {
          payment_collection_id: payment_collection.id,
        },
      },
      {
        [SUBSCRIPTION_MODULE]: {
          subscription_id: subscription.id,
        },
        [Modules.ORDER]: {
          order_id: order.id,
        },
      }
    )

    return new StepResponse({
      order,
      linkDefs,
    }, {
      order,
    })
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const orderModuleService = container.resolve(Modules.ORDER) as {
      cancel?: (id: string) => Promise<unknown>
    }
    if (typeof orderModuleService.cancel === "function") {
      await orderModuleService.cancel(data.order.id)
    }
  }
)

export default createSubscriptionOrderStep
