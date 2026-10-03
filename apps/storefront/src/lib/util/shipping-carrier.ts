export type ShippingCarrierKind = "usps" | "ups" | "dhl" | "dhl-express" | "fedex" | "generic"

export type QuotedShippingCarrier = {
  carrier: string
  service?: string
  label: string
}

export function shippingOptionCatalogId(option: {
  name?: string | null
  data?: { id?: unknown } | Record<string, unknown> | null
}) {
  const data = option.data as { id?: unknown } | null | undefined
  return String(data?.id || "")
}

export function carrierKindFromQuotedName(carrier?: string, service?: string): ShippingCarrierKind | null {
  const blob = `${carrier || ""} ${service || ""}`.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (!blob) {
    return null
  }
  if (blob.includes("usps")) {
    return "usps"
  }
  if (blob.includes("ups") && !blob.includes("usps")) {
    return "ups"
  }
  if (blob.includes("fedex")) {
    return "fedex"
  }
  if (blob.includes("dhl")) {
    if (blob.includes("express") && !blob.includes("ecs") && !blob.includes("packet")) {
      return "dhl-express"
    }
    return "dhl"
  }
  return "generic"
}

export function shippingCarrierKind(
  option: {
    name?: string | null
    data?: { id?: string } | Record<string, unknown> | null
  },
  quoted?: QuotedShippingCarrier | null
): ShippingCarrierKind {
  const fromQuote = carrierKindFromQuotedName(quoted?.carrier, quoted?.service)
  if (fromQuote) {
    return fromQuote
  }

  const optionId = shippingOptionCatalogId(option)
  const name = (option.name || "").toLowerCase()

  if (
    optionId === "easypost-usps" ||
    optionId === "easypost-usps-ground" ||
    optionId === "easypost-usps-priority" ||
    optionId.includes("usps") ||
    /\busps\b/.test(name)
  ) {
    return "usps"
  }

  if (
    optionId === "easypost-ups" ||
    optionId === "easypost-ups-ground" ||
    (optionId.includes("ups") && !optionId.includes("usps")) ||
    (/\bups\b/.test(name) && !/\busps\b/.test(name))
  ) {
    return "ups"
  }

  if (
    optionId === "easypost-express" ||
    optionId === "easypost-intl-express" ||
    optionId.includes("express") ||
    /express/.test(name)
  ) {
    return "dhl-express"
  }

  if (
    optionId === "easypost-alt" ||
    optionId === "easypost-intl-standard" ||
    /best value/.test(name)
  ) {
    return "dhl"
  }

  return "generic"
}

type PricedShippingOption = {
  id: string
  name?: string | null
  price_type?: string | null
  amount?: number | null
  data?: { id?: unknown } | Record<string, unknown> | null
}

export function shippingOptionAmount(
  option: PricedShippingOption,
  prices: Record<string, number> = {}
) {
  if (option.price_type === "calculated") {
    const amount = prices[option.id] ?? option.amount
    return typeof amount === "number" && amount > 0 ? amount : null
  }

  return typeof option.amount === "number" ? option.amount : null
}

export function shippingCatalogRank(option: {
  name?: string | null
  data?: { id?: unknown } | Record<string, unknown> | null
}) {
  const optionId = shippingOptionCatalogId(option)
  const name = (option.name || "").toLowerCase()

  if (/free standard/.test(name) || optionId === "free-standard-us") {
    return 0
  }
  if (optionId === "easypost-usps" || optionId.includes("usps") || /\busps\b/.test(name)) {
    return 1
  }
  if (
    optionId === "easypost-ups" ||
    (optionId.includes("ups") && !optionId.includes("usps")) ||
    (/\bups\b/.test(name) && !/\busps\b/.test(name))
  ) {
    return 2
  }
  if (
    optionId === "easypost-alt" ||
    optionId === "easypost-intl-standard" ||
    /best value/.test(name) ||
    /economy/.test(name)
  ) {
    return 3
  }
  if (optionId.includes("express") || /express/.test(name)) {
    return 4
  }
  return 5
}

export function compareShippingOptions(
  a: PricedShippingOption,
  b: PricedShippingOption,
  prices: Record<string, number> = {}
) {
  const amountA = shippingOptionAmount(a, prices)
  const amountB = shippingOptionAmount(b, prices)

  if (amountA != null && amountB != null && amountA !== amountB) {
    return amountA - amountB
  }
  if (amountA != null && amountB == null) {
    return -1
  }
  if (amountA == null && amountB != null) {
    return 1
  }
  return shippingCatalogRank(a) - shippingCatalogRank(b)
}

export function cheapestPaidOptionId(
  options: PricedShippingOption[],
  prices: Record<string, number> = {}
) {
  const waitingOnQuote = options.some(
    (option) =>
      option.price_type === "calculated" &&
      shippingOptionAmount(option, prices) == null
  )
  if (waitingOnQuote) {
    return null
  }

  const paid = options.flatMap((option) => {
    const amount = shippingOptionAmount(option, prices)
    return amount != null && amount > 0 ? [{ id: option.id, amount }] : []
  })

  if (paid.length < 2) {
    return null
  }

  paid.sort((a, b) => a.amount - b.amount)
  return paid[0].id
}
