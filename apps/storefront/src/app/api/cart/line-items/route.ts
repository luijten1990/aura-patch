import { addToCart } from "@lib/data/cart"
import type { PurchaseType } from "@lib/util/subscription"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    variantId?: string
    quantity?: number
    countryCode?: string
    purchaseType?: PurchaseType
  } | null

  const variantId = body?.variantId
  const countryCode = body?.countryCode || "us"
  const quantity = Number(body?.quantity) || 1
  const purchaseType = body?.purchaseType === "one_time" ? "one_time" : "subscription"

  if (!variantId) {
    return NextResponse.json(
      { ok: false, error: "Missing product variant." },
      { status: 400 }
    )
  }

  try {
    await addToCart({
      variantId,
      quantity,
      countryCode,
      purchaseType,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not add Aura Patch to the cart. Please try again."
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
