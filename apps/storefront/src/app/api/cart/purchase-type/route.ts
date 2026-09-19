import { setCartPurchaseType } from "@lib/data/cart"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    purchaseType?: string
  } | null
  const purchaseType = body?.purchaseType === "one_time" ? "one_time" : "subscription"

  try {
    await setCartPurchaseType(purchaseType)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not update the purchase type."
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
