export type EasyPostOptionZone = "us" | "intl"
export type EasyPostBucket = "usps" | "ups" | "alt" | "express"

export type EasyPostRateOption = {
  id: string
  name: string
  description: string
  code: string
  zone: EasyPostOptionZone
  bucket: EasyPostBucket
}

export const LEGACY_EASYPOST_OPTION_ID = "easypost"

const BUCKETS: {
  id: string
  name: string
  code: string
  bucket: EasyPostBucket
  us: string
  intl: string
}[] = [
  {
    id: "easypost-usps",
    name: "USPS",
    code: "usps",
    bucket: "usps",
    us: "Tracked · typically 2–5 business days",
    intl: "Tracked · typically 6–12 business days",
  },
  {
    id: "easypost-ups",
    name: "UPS",
    code: "ups",
    bucket: "ups",
    us: "Tracked · typically 1–5 business days",
    intl: "Tracked · typically 3–7 business days",
  },
  {
    id: "easypost-alt",
    name: "Best value",
    code: "best-value",
    bucket: "alt",
    us: "Lowest-cost tracked carrier besides USPS and UPS · typically 2–7 business days",
    intl: "Lowest-cost tracked carrier besides USPS and UPS · typically 6–12 business days",
  },
  {
    id: "easypost-express",
    name: "Express",
    code: "express",
    bucket: "express",
    us: "Tracked · typically 1–2 business days",
    intl: "Tracked · typically 1–4 business days",
  },
]

export const EASYPOST_RATE_OPTIONS: EasyPostRateOption[] = BUCKETS.flatMap((bucket) => [
  {
    id: bucket.id,
    name: bucket.name,
    description: bucket.us,
    code: bucket.code,
    zone: "us" as const,
    bucket: bucket.bucket,
  },
  {
    id: bucket.id,
    name: bucket.name,
    description: bucket.intl,
    code: bucket.code,
    zone: "intl" as const,
    bucket: bucket.bucket,
  },
])

export function rateBlob(carrier?: string, service?: string) {
  return `${carrier || ""} ${service || ""}`.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function isUspsRate(carrier?: string, service?: string) {
  return rateBlob(carrier, service).includes("usps")
}

export function isUpsRate(carrier?: string, service?: string) {
  const blob = rateBlob(carrier, service)
  return blob.includes("ups") && !blob.includes("usps")
}

export function isEconomyRate(carrier?: string, service?: string) {
  const blob = rateBlob(carrier, service)
  return (
    blob.includes("firstclass") ||
    blob.includes("packet") ||
    blob.includes("ecommerce") ||
    blob.includes("dhlecs") ||
    blob.includes("dhlglobalmail") ||
    blob.includes("smartmail") ||
    blob.includes("asendia") ||
    blob.includes("epaq") ||
    blob.includes("groundadvantage") ||
    blob.includes("prioritymailinternational") ||
    ((blob.includes("standard") || blob.includes("economy") || blob.includes("ground")) &&
      !blob.includes("express") &&
      !blob.includes("worldwideexpedited"))
  )
}

export function isPremiumExpressRate(carrier?: string, service?: string) {
  const blob = rateBlob(carrier, service)
  if (isEconomyRate(carrier, service)) {
    return false
  }
  return (
    blob.includes("dhlexpress") ||
    blob.includes("expressworldwide") ||
    blob.includes("expresseasy") ||
    blob.includes("prioritymailexpress") ||
    blob.includes("nextday") ||
    blob.includes("overnight") ||
    blob.includes("2ndday") ||
    blob.includes("secondday") ||
    (blob.includes("fedex") &&
      (blob.includes("priority") || blob.includes("first") || blob.includes("overnight"))) ||
    (blob.includes("ups") &&
      (blob.includes("worldwideexpress") || blob.includes("saver"))) ||
    (blob.includes("express") && !blob.includes("expedited"))
  )
}

export function isExpressRate(carrier?: string, service?: string) {
  return isPremiumExpressRate(carrier, service)
}

export function optionBucket(optionId: string): EasyPostBucket | "any" {
  switch (optionId) {
    case "easypost-usps":
    case "easypost-usps-ground":
    case "easypost-usps-priority":
      return "usps"
    case "easypost-ups":
    case "easypost-ups-ground":
      return "ups"
    case "easypost-alt":
    case "easypost-intl-standard":
      return "alt"
    case "easypost-express":
    case "easypost-intl-express":
      return "express"
    default:
      return "any"
  }
}

export function matchesEasyPostOption(
  optionId: string,
  carrier?: string,
  service?: string
) {
  const bucket = optionBucket(optionId)
  if (bucket === "usps") {
    return isUspsRate(carrier, service)
  }
  if (bucket === "ups") {
    return isUpsRate(carrier, service)
  }
  if (bucket === "alt") {
    return !isUspsRate(carrier, service) && !isUpsRate(carrier, service)
  }
  if (bucket === "express") {
    return isPremiumExpressRate(carrier, service)
  }
  return true
}
