export type CheckoutQuoteAddress = {
  address_1?: string
  address_2?: string
  city?: string
  province?: string
  postal_code?: string
  country_code?: string
  first_name?: string
  last_name?: string
  company?: string
  phone?: string
}

export type CheckoutQuoteMap = Record<
  string,
  { carrier: string; service?: string; label: string; amount?: number }
>

const CACHE_MS = 10 * 60 * 1000

let memory: { key: string; quotes: CheckoutQuoteMap; at: number } | null = null
let inflight: { key: string; promise: Promise<CheckoutQuoteMap> } | null = null

export function checkoutQuoteKey(address?: CheckoutQuoteAddress | null) {
  const street = address?.address_1?.trim() || ""
  const city = address?.city?.trim() || ""
  const postal = address?.postal_code?.trim() || ""
  const country = address?.country_code?.trim().toLowerCase() || ""
  if (street.length < 5 || city.length < 2 || postal.length < 4 || country.length !== 2) {
    return ""
  }
  return `${country}|${postal}`
}

export function cachedCheckoutQuotes(address?: CheckoutQuoteAddress | null) {
  const key = checkoutQuoteKey(address)
  if (!key || !memory || memory.key !== key || Date.now() - memory.at > CACHE_MS) {
    return null
  }
  return memory.quotes
}

export function prefetchCheckoutQuotes(address?: CheckoutQuoteAddress | null) {
  const key = checkoutQuoteKey(address)
  if (!key || !address) {
    return null
  }
  const cached = cachedCheckoutQuotes(address)
  if (cached) {
    return Promise.resolve(cached)
  }
  if (inflight?.key === key) {
    return inflight.promise
  }

  const promise = fetch("/api/cart/shipping-quotes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ shipping_address: address }),
  })
    .then(async (response) => {
      const result = (await response.json().catch(() => null)) as { quotes?: CheckoutQuoteMap } | null
      const quotes = result?.quotes || {}
      if (response.ok && Object.keys(quotes).length) {
        memory = { key, quotes, at: Date.now() }
      }
      return quotes
    })
    .catch(() => ({}) as CheckoutQuoteMap)
    .finally(() => {
      if (inflight?.promise === promise) {
        inflight = null
      }
    })

  inflight = { key, promise }
  return promise
}
