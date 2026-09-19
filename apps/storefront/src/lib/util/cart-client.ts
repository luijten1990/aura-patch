import type { PurchaseType } from "@lib/util/subscription"

async function cartJson(path: string, method: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  const result = (await response.json().catch(() => null)) as {
    ok?: boolean
    error?: string
  } | null

  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || "Could not update the cart. Please try again.")
  }
}

export async function updateLineItemRequest({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  await cartJson("/api/cart/line-items", "PATCH", { lineId, quantity })
}

export async function deleteLineItemRequest(lineId: string) {
  await cartJson("/api/cart/line-items", "DELETE", { lineId })
}

export async function setCartPurchaseTypeRequest(purchaseType: PurchaseType) {
  await cartJson("/api/cart/purchase-type", "POST", { purchaseType })
}

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
