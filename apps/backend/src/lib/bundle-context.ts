type BundleCart = {
  currency_code?: string
  metadata?: Record<string, unknown> | null
  items?: {
    product_handle?: string | null
    quantity?: number
    metadata?: Record<string, unknown> | null
  }[] | null
}

// Derive eligibility from persisted cart items, never client-supplied tier metadata.
export function bundlePromotionContext(cart: BundleCart) {
  const subscription = Boolean(cart.metadata?.subscription_interval) ||
    Boolean(cart.items?.some((item) => item.metadata?.purchase_type === "subscription"))
  const quantity = (cart.items || []).reduce((sum, item) => {
    const count = Number(item.quantity)
    return item.product_handle === "aura-patch" && Number.isSafeInteger(count) && count > 0
      ? sum + count : sum
  }, 0)
  const tier = subscription || cart.currency_code?.toLowerCase() !== "usd"
    ? 0 : quantity >= 4 ? 20 : quantity === 3 ? 15 : quantity === 2 ? 10 : 0
  return { aura_bundle_tier: String(tier), aura_subscription: String(subscription) }
}
