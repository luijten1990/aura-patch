import { bundlePromotionContext } from "../bundle-context"

const cart = (quantity: number) => ({
  currency_code: "usd",
  items: [{ product_handle: "aura-patch", quantity, metadata: { purchase_type: "one_time" } }],
})

describe("authoritative bundle eligibility", () => {
  it.each([[1, "0"], [2, "10"], [3, "15"], [4, "20"], [5, "20"], [0, "0"], [-1, "0"], [2.5, "0"]])(
    "recalculates quantity %s to tier %s", (quantity, tier) => {
      expect(bundlePromotionContext(cart(quantity as number)).aura_bundle_tier).toBe(tier)
    }
  )
  it("counts split Aura lines but excludes other products", () => {
    const value = cart(1)
    value.items.push(...cart(1).items, { ...cart(4).items[0], product_handle: "other" })
    expect(bundlePromotionContext(value).aura_bundle_tier).toBe("10")
  })
  it("never trusts a requested tier in metadata", () => {
    expect(bundlePromotionContext({ ...cart(1), metadata: { aura_bundle_tier: "20" } }).aura_bundle_tier).toBe("0")
  })
  it("does not apply to other currencies or subscription carts", () => {
    expect(bundlePromotionContext({ ...cart(4), currency_code: "eur" }).aura_bundle_tier).toBe("0")
    expect(bundlePromotionContext({ ...cart(4), metadata: { subscription_interval: "monthly" } }).aura_bundle_tier).toBe("0")
    const value = cart(4)
    value.items[0].metadata.purchase_type = "subscription"
    expect(bundlePromotionContext(value).aura_bundle_tier).toBe("0")
  })
})
