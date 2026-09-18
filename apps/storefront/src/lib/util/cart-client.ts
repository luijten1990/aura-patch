import type { PurchaseType } from "@lib/util/subscription"

export async function addLineItemRequest({
  variantId,
  quantity,
  countryCode,
  purchaseType = "subscription",
}: {
  variantId: string
  quantity: number
  countryCode: string
  purchaseType?: PurchaseType
}) {
  const response = await fetch("/api/cart/line-items", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      variantId,
      quantity,
      countryCode,
      purchaseType,
    }),
  })
  const result = (await response.json().catch(() => null)) as {
    ok?: boolean
    error?: string
  } | null

  if (!response.ok || !result?.ok) {
    throw new Error(
      result?.error || "Could not add Aura Patch to the cart. Please try again."
    )
  }
}
