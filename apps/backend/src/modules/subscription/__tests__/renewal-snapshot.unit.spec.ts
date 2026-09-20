import { buildRenewalSnapshot, readRenewalSnapshot } from "../renewal-snapshot"

describe("buildRenewalSnapshot", () => {
  it("copies order money, items, and shipping without leftover address ids", () => {
    const snapshot = buildRenewalSnapshot({
      customer_id: "cus_1",
      email: "buyer@example.com",
      currency_code: "usd",
      region_id: "reg_1",
      sales_channel_id: "sc_1",
      total: 46.07,
      shipping_address: {
        id: "addr_ship",
        first_name: "Test",
        created_at: "2026-09-01",
        updated_at: "2026-09-01",
      },
      items: [
        {
          title: "Aura Patch",
          variant_id: "var_1",
          quantity: 1,
          unit_price: 39.99,
          metadata: { purchase_type: "subscription" },
        },
      ],
      shipping_methods: [
        {
          name: "USPS Ground",
          amount: 6.08,
          is_tax_inclusive: false,
        },
      ],
    })

    expect(snapshot.amount).toBe(46.07)
    expect(snapshot.items[0].unit_price).toBe(39.99)
    expect(snapshot.shipping_methods[0].amount).toBe(6.08)
    expect(snapshot.shipping_address).toEqual({
      first_name: "Test",
      id: null,
    })
  })
})

describe("readRenewalSnapshot", () => {
  it("returns null when the snapshot has no items", () => {
    expect(
      readRenewalSnapshot({
        renewal: {
          currency_code: "usd",
          amount: 0,
          items: [],
          shipping_methods: [],
        },
      })
    ).toBeNull()
  })
})
