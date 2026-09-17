import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  authorizePaymentSessionStep,
  capturePaymentStep,
  createPaymentCollectionsStep,
  createPaymentSessionsWorkflow,
  createRemoteLinkStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import { STRIPE_PROVIDER_ID } from "../../modules/subscription/constants"
import { SubscriptionData } from "../../modules/subscription/types"
import createSubscriptionOrderStep, {
  CreateSubscriptionOrderStepInput,
} from "./steps/create-subscription-order"
import fulfillSubscriptionOrderStep from "./steps/fulfill-subscription-order"
import getRenewalSnapshotStep from "./steps/get-renewal-snapshot"
import {
  getPaymentMethodStep,
  GetPaymentMethodStepInput,
} from "./steps/get-payment-method"
import updateSubscriptionStep from "./steps/update-subscription"

type WorkflowInput = {
  subscription: SubscriptionData
}

const createSubscriptionOrderWorkflow = createWorkflow(
  "create-subscription-order",
  (input: WorkflowInput) => {
    const { data: subscriptions } = useQueryGraphStep({
      entity: "subscription",
      fields: [
        "*",
        "customer.id",
        "customer.email",
        "customer.account_holders.*",
      ],
      filters: {
        id: input.subscription.id,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    })

    const snapshot = getRenewalSnapshotStep({
      subscription_id: input.subscription.id,
    })

    const paymentCollectionData = transform({
      snapshot,
    }, (data) => ({
      currency_code: data.snapshot.currency_code,
      amount: data.snapshot.amount,
    }))

    const payment_collection = createPaymentCollectionsStep([
      paymentCollectionData,
    ])[0]

    const defaultPaymentMethod = getPaymentMethodStep({
      customer: subscriptions[0].customer,
    } as unknown as GetPaymentMethodStepInput)

    const paymentSessionData = transform({
      payment_collection,
      subscriptions,
      defaultPaymentMethod,
    }, (data) => ({
      payment_collection_id: data.payment_collection.id,
      provider_id: STRIPE_PROVIDER_ID,
      customer_id: (data.subscriptions[0] as { customer?: { id?: string } }).customer?.id,
      data: {
        payment_method: data.defaultPaymentMethod.id,
        off_session: true,
        confirm: true,
        capture_method: "automatic",
      },
    }))

    const paymentSession = createPaymentSessionsWorkflow.runAsStep({
      input: paymentSessionData,
    })

    const payment = authorizePaymentSessionStep({
      id: paymentSession.id,
      context: paymentSession.context,
    })

    const orderInput = transform({
      subscription: input.subscription,
      snapshot,
      payment_collection,
    }, (data) => ({
      subscription: data.subscription,
      snapshot: data.snapshot,
      payment_collection: data.payment_collection,
    }))

    const { order, linkDefs } = createSubscriptionOrderStep(
      orderInput as unknown as CreateSubscriptionOrderStepInput
    )

    createRemoteLinkStep(linkDefs)

    capturePaymentStep({
      payment_id: payment.id,
      amount: payment.amount,
    })

    updateSubscriptionStep({
      subscription_id: input.subscription.id,
    })

    fulfillSubscriptionOrderStep({
      order_id: order.id,
    })

    return new WorkflowResponse({
      order,
    })
  }
)

export default createSubscriptionOrderWorkflow
