export type EasyPostOptionZone = "us" | "intl"

export type EasyPostRateOption = {
  id: string
  name: string
  description: string
  code: string
  zone: EasyPostOptionZone
}

export const LEGACY_EASYPOST_OPTION_ID = "easypost"

export const EASYPOST_RATE_OPTIONS: EasyPostRateOption[] = [
  {
    id: "easypost-usps-ground",
    name: "USPS Ground Advantage",
    description: "Tracked USPS ground, typically 2-5 business days.",
    code: "usps-ground",
    zone: "us",
  },
  {
    id: "easypost-usps-priority",
    name: "USPS Priority Mail",
    description: "Tracked USPS Priority, typically 1-3 business days.",
    code: "usps-priority",
    zone: "us",
  },
  {
    id: "easypost-ups-ground",
    name: "UPS Ground",
    description: "Tracked UPS Ground.",
    code: "ups-ground",
    zone: "us",
  },
  {
    id: "easypost-express",
    name: "Express",
    description: "Fastest tracked option from EasyPost for this address.",
    code: "express",
    zone: "us",
  },
  {
    id: "easypost-intl-standard",
    name: "International Standard",
    description: "Tracked international economy from EasyPost.",
    code: "intl-standard",
    zone: "intl",
  },
  {
    id: "easypost-intl-express",
    name: "International Express",
    description: "Tracked international express from EasyPost.",
    code: "intl-express",
    zone: "intl",
  },
]

export function rateBlob(carrier?: string, service?: string) {
  return `${carrier || ""} ${service || ""}`.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function isExpressRate(carrier?: string, service?: string) {
  const blob = rateBlob(carrier, service)
  return (
    blob.includes("express") ||
    blob.includes("nextday") ||
    blob.includes("2ndday") ||
    blob.includes("secondday") ||
    blob.includes("overnight")
  )
}

export function matchesEasyPostOption(
  optionId: string,
  carrier?: string,
  service?: string
) {
  const blob = rateBlob(carrier, service)
  switch (optionId) {
    case "easypost-usps-ground":
      return (
        blob.includes("usps") &&
        (blob.includes("groundadvantage") || blob.includes("firstclass"))
      )
    case "easypost-usps-priority":
      return blob.includes("usps") && blob.includes("priority") && !blob.includes("express")
    case "easypost-ups-ground":
      return blob.includes("ups") && blob.includes("ground") && !blob.includes("surepost")
    case "easypost-express":
      return isExpressRate(carrier, service) && !blob.includes("surepost")
    case "easypost-intl-express":
      return isExpressRate(carrier, service)
    case "easypost-intl-standard":
      return !isExpressRate(carrier, service)
    default:
      return true
  }
}
