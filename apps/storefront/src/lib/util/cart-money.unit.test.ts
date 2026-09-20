import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  lineItemAmount,
  withCartMoney,
} from "./cart-money.ts"

describe("lineItemAmount", () => {
  it("applies the subscribe discount from unit price", () => {
    assert.equal(
      lineItemAmount({
        unit_price: 50,
        quantity: 1,
        metadata: { purchase_type: "subscription" },
      }),
      40
    )
  })

  it("keeps one-time line items at full price", () => {
    assert.equal(
      lineItemAmount({
        unit_price: 49.99,
        quantity: 1,
        total: 49.99,
        metadata: { purchase_type: "one_time" },
      }),
      49.99
    )
  })
})

describe("withCartMoney", () => {
  it("totals a subscribe cart from discounted items plus shipping", () => {
    const cart = withCartMoney({
      currency_code: "usd",
      metadata: {
        subscription_interval: "monthly",
        subscription_period: 1,
      },
      promotions: [{ code: "SUBSCRIBE20" }],
      items: [
        {
          unit_price: 50,
          quantity: 1,
          total: 50,
          metadata: { purchase_type: "subscription" },
        },
      ],
      shipping_methods: [{ amount: 6.07 }],
      tax_total: 0,
    })

    assert.equal(cart.item_subtotal, 40)
    assert.equal(cart.shipping_subtotal, 6.07)
    assert.equal(cart.total, 46.07)
  })

  it("does not apply subscribe pricing to a one-time cart", () => {
    const cart = withCartMoney({
      currency_code: "usd",
      metadata: {
        subscription_interval: "",
        subscription_period: 0,
      },
      items: [
        {
          unit_price: 50,
          quantity: 1,
          total: 50,
          metadata: { purchase_type: "one_time" },
        },
      ],
      shipping_methods: [{ amount: 6.07 }],
      tax_total: 0,
      total: 56.07,
    })

    assert.equal(cart.item_subtotal, 50)
    assert.equal(cart.total, 56.07)
  })
})
