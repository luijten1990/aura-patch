import { buildRenewalSnapshot } from "../../subscription/renewal-snapshot"
import { commissionAmount } from "../commission"
import {
  applyRefund,
  netProductAmount,
  recordOnce,
  renewalOrderMetadata,
  rowsForViewer,
  type LedgerRow,
} from "../ledger"

const paidOrder = (base: number, rate = 20): LedgerRow => ({
  orderId: "order_1",
  affiliateEmail: "maya@example.com",
  base,
  rate,
  commission: commissionAmount(base, rate),
  status: "pending",
})

describe("affiliate financial backbone", () => {
  it("keeps the partner on the subscription snapshot and the renewal order without a cookie", () => {
    const snapshot = buildRenewalSnapshot({
      customer_id: "cus_1",
      email: "buyer@example.com",
      currency_code: "usd",
      total: 39.99,
      metadata: { referral_code: "maya" },
      items: [
        {
          title: "Aura Patch",
          quantity: 1,
          unit_price: 39.99,
          metadata: { purchase_type: "subscription" },
        },
      ],
      shipping_methods: [],
    })

    expect(snapshot.referral_code).toBe("maya")
    expect(snapshot.customer_id).toBe("cus_1")
    expect(renewalOrderMetadata(snapshot.referral_code, "sub_1")).toEqual({
      referral_code: "maya",
      referral_source: "renewal",
      subscription_id: "sub_1",
    })
    expect(renewalOrderMetadata(undefined, "sub_1")).toBeUndefined()
  })

  it("pays 20 percent of product sales after discounts and ignores shipping", () => {
    const net = netProductAmount(49.99, 10)
    expect(net).toBe(39.99)
    expect(commissionAmount(net, 20)).toBe(8)
  })

  it("records one commission when the same paid order is delivered twice", () => {
    const first = recordOnce([], paidOrder(50))
    const second = recordOnce(first.rows, paidOrder(50))

    expect(first.created).toBe(true)
    expect(second.created).toBe(false)
    expect(second.rows).toHaveLength(1)
    expect(second.row.commission).toBe(10)
  })

  it("voids a full refund and reduces a partial refund", () => {
    const row = paidOrder(50)
    expect(applyRefund(row, 50)).toMatchObject({
      base: 0,
      commission: 0,
      status: "void",
    })
    expect(applyRefund(row, 20)).toMatchObject({
      base: 30,
      commission: 6,
      status: "pending",
    })
  })

  it("returns only the signed-in ambassador's rows", () => {
    const rows = [
      paidOrder(50),
      { ...paidOrder(80), orderId: "order_2", affiliateEmail: "other@example.com" },
    ]
    const visible = rowsForViewer(rows, "Maya@example.com")
    expect(visible.map((row) => row.orderId)).toEqual(["order_1"])
  })
})
