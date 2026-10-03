export const BUNDLE_CODES = ["BUNDLE10", "BUNDLE15", "BUNDLE20"] as const

export const BUNDLE_UNIT_PRICE = 49.99

export const bundleTiers = [
  { quantity: 1, percent: 0, days: 30 },
  { quantity: 2, percent: 10, days: 60 },
  { quantity: 3, percent: 15, days: 90 },
  { quantity: 4, percent: 20, days: 120 },
] as const

export const roundCents = (amount: number) => Math.round(amount * 100) / 100

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

export const bundleCodeForQuantity = (quantity: number) => {
  const percent = bundlePercentForQuantity(quantity)
  return percent ? `BUNDLE${percent}` : null
}

export const bundleAmount = (unitPrice: number, quantity: number) => {
  const percent = bundlePercentForQuantity(quantity)
  return roundCents(unitPrice * quantity * ((100 - percent) / 100))
}

export const bundleUnitAmount = (unitPrice: number, quantity: number) =>
  roundCents(bundleAmount(unitPrice, quantity) / quantity)

export const isBundleCode = (code: string) =>
  BUNDLE_CODES.includes(code as (typeof BUNDLE_CODES)[number])
