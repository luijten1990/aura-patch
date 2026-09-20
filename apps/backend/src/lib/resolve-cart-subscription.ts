import { SubscriptionInterval } from "../modules/subscription/types"

export type CartSubscriptionSource = {
  metadata?: Record<string, unknown> | null
  items?: { metadata?: Record<string, unknown> | null }[] | null
}

type ResolvedCartSubscription =
  | {
      ok: true
      interval: SubscriptionInterval
      period: number
    }
  | {
      ok: false
    }

export function resolveCartSubscription(
  cart?: CartSubscriptionSource | null
): ResolvedCartSubscription {
  const metadata = (cart?.metadata || {}) as Record<string, unknown>
  let interval = metadata.subscription_interval
  let period = Number(metadata.subscription_period)

  const hasSubscribeItem = Boolean(
    (cart?.items || []).some((item) => {
      const itemMetadata = (item?.metadata || {}) as Record<string, unknown>
      return itemMetadata.purchase_type === "subscription"
    })
  )

  if (
    interval !== SubscriptionInterval.MONTHLY &&
    interval !== SubscriptionInterval.YEARLY &&
    hasSubscribeItem
  ) {
    interval = SubscriptionInterval.MONTHLY
    period = 1
  }

  if (
    interval !== SubscriptionInterval.MONTHLY &&
    interval !== SubscriptionInterval.YEARLY
  ) {
    return { ok: false }
  }

  if (!Number.isFinite(period) || period < 1) {
    return { ok: false }
  }

  return {
    ok: true,
    interval,
    period,
  }
}
