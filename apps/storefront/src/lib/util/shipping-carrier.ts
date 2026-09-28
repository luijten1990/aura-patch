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

export function isBestValueOption(option: {
  name?: string | null
  data?: { id?: unknown } | Record<string, unknown> | null
}) {
  const optionId = shippingOptionCatalogId(option)
  const name = (option.name || "").toLowerCase()
  return (
    optionId === "easypost-alt" ||
    optionId === "easypost-intl-standard" ||
    /best value/.test(name)
  )
}
