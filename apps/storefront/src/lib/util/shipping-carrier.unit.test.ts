import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  carrierKindFromQuotedName,
  isBestValueOption,
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

describe("isBestValueOption", () => {
  it("detects the lowest-cost non-USPS/UPS option", () => {
    assert.equal(isBestValueOption({ data: { id: "easypost-alt" } }), true)
  })
})
