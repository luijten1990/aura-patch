import { BigNumber } from "@medusajs/utils"
import {
  buildRenewalSnapshot,
  readRenewalSnapshot,
  renewalSnapshotMissingPrices,
} from "../renewal-snapshot"

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

  it("stores the 20% Subscribe & Save price when the order still has the full pouch price", () => {
    const snapshot = buildRenewalSnapshot({
      currency_code: "usd",
      total: 56.07,
      items: [
        {
          title: "Aura Core",
          quantity: 1,
          unit_price: 49.99,
          metadata: { purchase_type: "subscription" },
        },
      ],
      shipping_methods: [{ name: "USPS Ground", amount: 6.08 }],
    })

    expect(snapshot.items[0].unit_price).toBe(39.99)
    expect(snapshot.amount).toBe(46.07)
  })

  it("reads Medusa BigNumber, raw money objects, and numeric strings", () => {
    const fromBigNumber = buildRenewalSnapshot({
      currency_code: "eur",
      total: new BigNumber("49.992"),
      items: [
        {
          title: "Aura Core",
          quantity: new BigNumber("1"),
          unit_price: new BigNumber({ value: "49.99", precision: 20 }),
          metadata: { purchase_type: "subscription" },
        },
      ],
      shipping_methods: [
        {
          name: "Standard Shipping",
          amount: new BigNumber({ value: "10", precision: 20 }),
        },
      ],
    })

    expect(fromBigNumber.items[0].quantity).toBe(1)
    expect(fromBigNumber.items[0].unit_price).toBe(39.99)
    expect(fromBigNumber.shipping_methods[0].amount).toBe(10)
    expect(fromBigNumber.amount).toBe(49.99)

    const fromRaw = buildRenewalSnapshot({
      currency_code: "eur",
      total: { value: "49.992", precision: 20 },
      items: [
        {
          title: "Aura Core",
          quantity: { value: "1", precision: 20 },
          unit_price: null,
          raw_unit_price: { value: "49.99", precision: 20 },
          metadata: { purchase_type: "subscription" },
        },
      ],
      shipping_methods: [
        {
          name: "Standard Shipping",
          amount: "10",
        },
      ],
    })

    expect(fromRaw.items[0].unit_price).toBe(39.99)
    expect(fromRaw.shipping_methods[0].amount).toBe(10)
    expect(fromRaw.amount).toBe(49.99)
    expect(renewalSnapshotMissingPrices(fromRaw)).toBe(false)
    expect(renewalSnapshotMissingPrices({
      currency_code: "eur",
      amount: 0,
      items: [{ quantity: 1, unit_price: 0 }],
      shipping_methods: [{ name: "Standard Shipping", amount: 0 }],
    })).toBe(true)
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
