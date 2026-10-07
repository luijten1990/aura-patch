import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { lineItemAmount, withCartMoney } from "./cart-money.ts"

describe("confirmed Medusa cart money", () => {
  it("does not invent bundle or subscription discounts", () => {
    for (const purchase_type of ["one_time", "subscription"]) {
      assert.equal(lineItemAmount({ unit_price: 49.99, quantity: 2, total: 99.98, metadata: { purchase_type } }), 99.98)
    }
  })
  it("preserves zero and discounted server totals", () => {
    assert.equal(lineItemAmount({ unit_price: 49.99, quantity: 2, total: 89.98 }), 89.98)
    assert.equal(lineItemAmount({ unit_price: 49.99, quantity: 2, total: 0 }), 0)
  })
  it("shows gross subtotal, applied discount, and the actual payable total", () => {
    const result = withCartMoney({
      items: [{ unit_price: 49.99, quantity: 2, total: 89.98 }],
      item_subtotal: 99.98, discount_subtotal: 10,
      shipping_subtotal: 0, tax_total: 3, total: 92.98,
    })
    assert.equal(result.item_subtotal, 99.98)
    assert.equal(result.discount_subtotal, 10)
    assert.equal(result.total, 92.98)
  })
  it("does not override free shipping or a zero payable total", () => {
    const result = withCartMoney({
      items: [{ unit_price: 49.99, quantity: 1, total: 0 }],
      item_subtotal: 49.99, discount_subtotal: 49.99,
      shipping_subtotal: 0, shipping_methods: [{ amount: 6 }], total: 0,
    })
    assert.equal(result.shipping_subtotal, 0)
    assert.equal(result.total, 0)
  })
})
