import { SubscriptionInterval } from "../../modules/subscription/types"
import { resolveCartSubscription } from "../resolve-cart-subscription"

describe("resolveCartSubscription", () => {
  it("defaults a subscribe line item to monthly when cart metadata is missing", () => {
    const result = resolveCartSubscription({
      metadata: {},
      items: [{ metadata: { purchase_type: "subscription" } }],
    })

    expect(result).toEqual({
      ok: true,
      interval: SubscriptionInterval.MONTHLY,
      period: 1,
    })
  })

  it("accepts monthly cart metadata without subscribe line items", () => {
    const result = resolveCartSubscription({
      metadata: {
        subscription_interval: "monthly",
        subscription_period: 1,
      },
      items: [{ metadata: { purchase_type: "one_time" } }],
    })

    expect(result).toEqual({
      ok: true,
      interval: SubscriptionInterval.MONTHLY,
      period: 1,
    })
  })

  it("rejects a one-time cart", () => {
    expect(
      resolveCartSubscription({
        metadata: {
          subscription_interval: "",
          subscription_period: 0,
        },
        items: [{ metadata: { purchase_type: "one_time" } }],
      })
    ).toEqual({ ok: false })
  })

  it("rejects monthly metadata with an invalid period", () => {
    expect(
      resolveCartSubscription({
        metadata: {
          subscription_interval: "monthly",
          subscription_period: 0,
        },
        items: [{ metadata: { purchase_type: "subscription" } }],
      })
    ).toEqual({ ok: false })
  })

  it("keeps a yearly interval from cart metadata", () => {
    expect(
      resolveCartSubscription({
        metadata: {
          subscription_interval: "yearly",
          subscription_period: 1,
        },
        items: [{ metadata: { purchase_type: "subscription" } }],
      })
    ).toEqual({
      ok: true,
      interval: SubscriptionInterval.YEARLY,
      period: 1,
    })
  })
})
