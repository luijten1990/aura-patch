export const SUBSCRIBE_CODE = "SUBSCRIBE20"
export const SUBSCRIBE_PERCENT = 20
export const SUBSCRIPTION_INTERVAL = "monthly"
export const SUBSCRIPTION_PERIOD = 1

export type PurchaseType = "subscription" | "one_time"

export const isSubscriptionCart = (
  cart?: { metadata?: Record<string, unknown> | null } | null
) =>
  cart?.metadata?.subscription_interval === SUBSCRIPTION_INTERVAL &&
  Number(cart?.metadata?.subscription_period) > 0

export const subscriptionAmount = (amount: number) =>
  amount * ((100 - SUBSCRIBE_PERCENT) / 100)
