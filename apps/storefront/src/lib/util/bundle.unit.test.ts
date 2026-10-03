import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  bundleAmount,
  bundleCodeForQuantity,
  bundleUnitAmount,
  BUNDLE_UNIT_PRICE,
} from "./bundle.ts"

describe("bundle pricing", () => {
  it("matches the one-pouch price", () => {
    assert.equal(bundleAmount(BUNDLE_UNIT_PRICE, 1), 49.99)
    assert.equal(bundleUnitAmount(BUNDLE_UNIT_PRICE, 1), 49.99)
    assert.equal(bundleCodeForQuantity(1), null)
  })

  it("gives 10% off two pouches", () => {
    assert.equal(bundleAmount(BUNDLE_UNIT_PRICE, 2), 89.98)
    assert.equal(bundleUnitAmount(BUNDLE_UNIT_PRICE, 2), 44.99)
    assert.equal(bundleCodeForQuantity(2), "BUNDLE10")
  })

  it("gives 15% off three pouches", () => {
    assert.equal(bundleAmount(BUNDLE_UNIT_PRICE, 3), 127.47)
    assert.equal(bundleUnitAmount(BUNDLE_UNIT_PRICE, 3), 42.49)
    assert.equal(bundleCodeForQuantity(3), "BUNDLE15")
  })

  it("gives 20% off four pouches", () => {
    assert.equal(bundleAmount(BUNDLE_UNIT_PRICE, 4), 159.97)
    assert.equal(bundleUnitAmount(BUNDLE_UNIT_PRICE, 4), 39.99)
    assert.equal(bundleCodeForQuantity(4), "BUNDLE20")
  })

  it("keeps the 20% rate when quantity is above four", () => {
    assert.equal(bundleCodeForQuantity(5), "BUNDLE20")
  })
})