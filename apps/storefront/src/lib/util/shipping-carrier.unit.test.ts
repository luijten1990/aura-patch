import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  carrierKindFromQuotedName,
  cheapestPaidOptionId,
  compareShippingOptions,
  shippingCarrierKind,
} from "./shipping-carrier.ts"

describe("shippingCarrierKind", () => {
  it("maps USPS checkout options to usps", () => {
    assert.equal(
      shippingCarrierKind({ data: { id: "easypost-usps" } }),
      "usps"
    )
  })

  it("maps UPS checkout options to ups", () => {
    assert.equal(
      shippingCarrierKind({ data: { id: "easypost-ups" }, name: "UPS" }),
      "ups"
    )
  })

  it("maps Best value to DHL ecommerce until a live quote arrives", () => {
    assert.equal(
      shippingCarrierKind({ data: { id: "easypost-alt" }, name: "Best value" }),
      "dhl"
    )
  })

  it("maps Express to DHL Express", () => {
    assert.equal(
      shippingCarrierKind({ data: { id: "easypost-express" } }),
      "dhl-express"
    )
  })

  it("prefers the live quoted carrier for Best value", () => {
    assert.equal(
      shippingCarrierKind(
        { data: { id: "easypost-alt" } },
        { carrier: "FedEx", label: "FedEx" }
      ),
      "fedex"
    )
  })
})

describe("carrierKindFromQuotedName", () => {
  it("treats DhlEcs as DHL", () => {
    assert.equal(carrierKindFromQuotedName("DhlEcs", "PacketInternational"), "dhl")
  })
})

describe("cheapestPaidOptionId", () => {
  const options = [
    {
      id: "free",
      name: "Free Standard Shipping (5–7 business days)",
      price_type: "flat",
      amount: 0,
      data: { id: "free-standard-us" },
    },
    {
      id: "dhl",
      name: "Economy",
      price_type: "calculated",
      data: { id: "easypost-alt" },
    },
    {
      id: "usps",
      name: "USPS",
      price_type: "calculated",
      data: { id: "easypost-usps" },
    },
    {
      id: "express",
      name: "Express",
      price_type: "calculated",
      data: { id: "easypost-express" },
    },
  ]

  it("marks USPS when it is cheaper than DHL", () => {
    const prices = { dhl: 10.57, usps: 5.58, express: 21.67 }
    assert.equal(cheapestPaidOptionId(options, prices), "usps")
    assert.deepEqual(
      [...options].sort((a, b) => compareShippingOptions(a, b, prices)).map((option) => option.id),
      ["free", "usps", "dhl", "express"]
    )
  })

  it("marks DHL when that quote is the lowest paid price", () => {
    const prices = { dhl: 4, usps: 5.58, express: 21.67 }
    assert.equal(cheapestPaidOptionId(options, prices), "dhl")
  })

  it("waits until every calculated quote has a price", () => {
    assert.equal(cheapestPaidOptionId(options, { usps: 5.58 }), null)
  })
})
