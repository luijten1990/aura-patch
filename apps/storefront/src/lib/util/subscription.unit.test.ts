import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { isSubscriptionCart } from "./subscription.ts"

describe("isSubscriptionCart", () => {
  it("treats a subscribe line item as a subscription cart", () => {
    assert.equal(
      isSubscriptionCart({
        metadata: {},
        items: [{ metadata: { purchase_type: "subscription" } }],
      }),
      true
    )
  })

  it("treats monthly cart metadata as a subscription cart", () => {
    assert.equal(
      isSubscriptionCart({
        metadata: {
          subscription_interval: "monthly",
          subscription_period: 1,
        },
        items: [{ metadata: { purchase_type: "one_time" } }],
      }),
      true
    )
  })

  it("does not treat a one-time cart as a subscription cart", () => {
    assert.equal(
      isSubscriptionCart({
        metadata: {
          subscription_interval: "",
          subscription_period: 0,
        },
        items: [{ metadata: { purchase_type: "one_time" } }],
      }),
      false
    )
  })
})
