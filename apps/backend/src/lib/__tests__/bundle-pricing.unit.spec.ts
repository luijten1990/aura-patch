import { bundleLineTotal, bundlePercentForQuantity } from "../bundle-pricing"
import { FULL_POUCH_PRICE_USD } from "../../modules/subscription/constants"

describe("bundleLineTotal", () => {
  it("keeps one pouch at the full price", () => {
    expect(bundlePercentForQuantity(1)).toBe(0)
    expect(bundleLineTotal(FULL_POUCH_PRICE_USD, 1)).toBe(49.99)
  })

  it("prices two, three, and four pouches at 10, 15, and 20 percent off", () => {
    expect(bundleLineTotal(FULL_POUCH_PRICE_USD, 2)).toBe(89.98)
    expect(bundleLineTotal(FULL_POUCH_PRICE_USD, 3)).toBe(127.47)
    expect(bundleLineTotal(FULL_POUCH_PRICE_USD, 4)).toBe(159.97)
  })

  it("keeps the 20 percent rate above four pouches", () => {
    expect(bundlePercentForQuantity(5)).toBe(20)
    expect(bundleLineTotal(FULL_POUCH_PRICE_USD, 5)).toBe(199.96)
  })
})
