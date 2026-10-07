export const SUBSCRIBE_CODE = "SUBSCRIBE20"
export const SUBSCRIBE_PERCENT = 20
export const STRIPE_PROVIDER_ID = "pp_stripe_stripe"
export const FULL_POUCH_PRICE_USD = 49.99

export const subscribeUnitPrice = (amount: number) =>
  Math.round(amount * (100 - SUBSCRIBE_PERCENT)) / 100
