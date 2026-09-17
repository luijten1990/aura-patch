import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

type OrderRecord = {
  id?: string
  display_id?: number
  created_at?: string
  currency_code?: string
  payment_status?: string
  status?: string
  total?: number
  shipping_total?: number
  refunded_total?: number
  fulfillments?: {
    id?: string
    data?: Record<string, unknown>
  }[]
}

type StripeBank = {
  bank_name?: string
  last4?: string
  currency?: string
  country?: string
  status?: string
  default_for_currency?: boolean
}

type StripePayout = {
  id: string
  amount: number
  currency: string
  arrival_date: number
  status: string
}

export type FinancesOverview = {
  currency: string
  revenue_cents: number
  shipping_collected_cents: number
  refunds_cents: number
  label_cost_cents: number
  stripe_fees_cents: number
  profit_cents: number
  paid_order_count: number
  labeled_shipment_count: number
  stripe: {
    configured: boolean
    livemode: boolean
    payouts_enabled: boolean
    charges_enabled: boolean
    dashboard_payouts_url: string
    available_cents: number
    pending_cents: number
    bank: StripeBank | null
    recent_payouts: StripePayout[]
  }
}

const PAID_STATUSES = new Set(["captured", "partially_refunded", "partially_captured"])

const stripeGet = async (apiKey: string, path: string) => {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  const body = await response.json() as Record<string, unknown>
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Stripe request failed (${response.status})`
    )
  }
  return body
}

const asNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0

const getFinancesOverviewStep = createStep(
  "get-finances-overview",
  async (_, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "created_at",
        "currency_code",
        "payment_status",
        "status",
        "total",
        "shipping_total",
        "refunded_total",
        "fulfillments.id",
        "fulfillments.data",
      ],
      pagination: {
        skip: 0,
        take: 1000,
      },
    })

    const paidOrders = (orders as OrderRecord[]).filter((order) => {
      if (order.status === "canceled") {
        return false
      }
      return PAID_STATUSES.has(order.payment_status || "")
    })

    let revenueCents = 0
    let shippingCollectedCents = 0
    let refundsCents = 0
    let labelCostCents = 0
    let labeledShipmentCount = 0

    for (const order of paidOrders) {
      revenueCents += asNumber(order.total)
      shippingCollectedCents += asNumber(order.shipping_total)
      refundsCents += asNumber(order.refunded_total)
      for (const fulfillment of order.fulfillments || []) {
        const cost = asNumber(fulfillment.data?.easyship_label_cost_cents)
        if (cost > 0) {
          labelCostCents += cost
          labeledShipmentCount += 1
        }
      }
    }

    const stripeKey = process.env.STRIPE_API_KEY
    const stripe: FinancesOverview["stripe"] = {
      configured: Boolean(stripeKey),
      livemode: Boolean(stripeKey && !stripeKey.startsWith("sk_test_")),
      payouts_enabled: false,
      charges_enabled: false,
      dashboard_payouts_url: "https://dashboard.stripe.com/settings/payouts",
      available_cents: 0,
      pending_cents: 0,
      bank: null,
      recent_payouts: [],
    }

    let stripeFeesCents = 0

    if (stripeKey) {
      try {
        const account = await stripeGet(stripeKey, "/account")
        stripe.payouts_enabled = Boolean(account.payouts_enabled)
        stripe.charges_enabled = Boolean(account.charges_enabled)
        stripe.livemode = Boolean(account.livemode)
        stripe.dashboard_payouts_url = account.livemode
          ? "https://dashboard.stripe.com/settings/payouts"
          : "https://dashboard.stripe.com/test/settings/payouts"

        const accountId = typeof account.id === "string" ? account.id : ""
        if (accountId) {
          const banks = await stripeGet(
            stripeKey,
            `/accounts/${accountId}/external_accounts?object=bank_account&limit=10`
          )
          const list = Array.isArray(banks.data) ? banks.data as StripeBank[] : []
          stripe.bank = list.find((item) => item.default_for_currency) || list[0] || null
        }

        const balance = await stripeGet(stripeKey, "/balance")
        const available = Array.isArray(balance.available) ? balance.available as { amount?: number }[] : []
        const pending = Array.isArray(balance.pending) ? balance.pending as { amount?: number }[] : []
        stripe.available_cents = available.reduce((sum, item) => sum + asNumber(item.amount), 0)
        stripe.pending_cents = pending.reduce((sum, item) => sum + asNumber(item.amount), 0)

        const payouts = await stripeGet(stripeKey, "/payouts?limit=8")
        stripe.recent_payouts = (Array.isArray(payouts.data) ? payouts.data : []).map((item) => {
          const payout = item as Record<string, unknown>
          return {
            id: String(payout.id || ""),
            amount: asNumber(payout.amount),
            currency: String(payout.currency || "usd"),
            arrival_date: asNumber(payout.arrival_date),
            status: String(payout.status || ""),
          }
        })

        const fees = await stripeGet(stripeKey, "/balance_transactions?type=charge&limit=100")
        const feeRows = Array.isArray(fees.data) ? fees.data as { fee?: number }[] : []
        stripeFeesCents = feeRows.reduce((sum, row) => sum + asNumber(row.fee), 0)
      } catch (error) {
        logger.error(`Unable to load Stripe payouts: ${String(error)}`)
      }
    }

    const overview: FinancesOverview = {
      currency: "usd",
      revenue_cents: revenueCents,
      shipping_collected_cents: shippingCollectedCents,
      refunds_cents: refundsCents,
      label_cost_cents: labelCostCents,
      stripe_fees_cents: stripeFeesCents,
      profit_cents: revenueCents - refundsCents - labelCostCents - stripeFeesCents,
      paid_order_count: paidOrders.length,
      labeled_shipment_count: labeledShipmentCount,
      stripe,
    }

    return new StepResponse(overview)
  }
)

export const getFinancesOverviewWorkflow = createWorkflow(
  "get-finances-overview",
  () => {
    const overview = getFinancesOverviewStep()
    return new WorkflowResponse(overview)
  }
)
