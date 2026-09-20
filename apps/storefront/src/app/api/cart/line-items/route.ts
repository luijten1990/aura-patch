import { addToCart, deleteLineItem, setCartPurchaseType, updateLineItem } from "@lib/data/cart"
import type { PurchaseType } from "@lib/util/subscription"
import { after } from "next/server"
import { NextRequest, NextResponse } from "next/server"

function cartError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

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
    after(() => {
      void setCartPurchaseType(purchaseType).catch(() => undefined)
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

export async function PATCH(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    lineId?: string
    quantity?: number
  } | null
  const lineId = body?.lineId
  const quantity = Number(body?.quantity)

  if (!lineId || !Number.isFinite(quantity) || quantity < 1) {
    return NextResponse.json(
      { ok: false, error: "Missing line item or quantity." },
      { status: 400 }
    )
  }

  try {
    await updateLineItem({ lineId, quantity })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: cartError(error, "Could not update the quantity.") },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { lineId?: string } | null
  const lineId = body?.lineId

  if (!lineId) {
    return NextResponse.json(
      { ok: false, error: "Missing line item." },
      { status: 400 }
    )
  }

  try {
    await deleteLineItem(lineId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: cartError(error, "Could not remove that item.") },
      { status: 400 }
    )
  }
}
