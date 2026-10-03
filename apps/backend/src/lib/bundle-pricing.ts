import { FULL_POUCH_PRICE_USD } from "../modules/subscription/constants"

export const BUNDLE_PROMOTIONS = [
  { code: "BUNDLE10", percent: 10, quantity: 2 },
  { code: "BUNDLE15", percent: 15, quantity: 3 },
  { code: "BUNDLE20", percent: 20, quantity: 4 },
] as const

export const bundlePercentForQuantity = (quantity: number) => {
  if (quantity >= 4) {
    return 20
  }
  if (quantity === 3) {
    return 15
  }
  if (quantity === 2) {
    return 10
  }
  return 0
}

export const bundleLineTotal = (unitPrice: number, quantity: number) => {
  const percent = bundlePercentForQuantity(quantity)
  return Math.round(unitPrice * quantity * (100 - percent)) / 100
}

export const bundleTotalsAtFullPouchPrice = () =>
  [1, 2, 3, 4].map((quantity) => ({
    quantity,
    percent: bundlePercentForQuantity(quantity),
    total: bundleLineTotal(FULL_POUCH_PRICE_USD, quantity),
  }))
