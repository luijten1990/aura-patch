import { retrieveCart } from "@lib/data/cart"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheTag } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    cartId?: string
    shippingMethodId?: string
  } | null

  const cartId = body?.cartId
  const shippingMethodId = body?.shippingMethodId

  if (!cartId || !shippingMethodId) {
    return NextResponse.json(
      { ok: false, error: "Missing shipping details." },
      { status: 400 }
    )
  }

  try {
    await sdk.store.cart.addShippingMethod(
      cartId,
      { option_id: shippingMethodId },
      {},
      { ...(await getAuthHeaders()) }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: shippingMethodError(error) },
      { status: 400 }
    )
  }

  const cartCacheTag = await getCacheTag("carts")
  if (cartCacheTag) {
    revalidateTag(cartCacheTag)
  }

  try {
    const cart = await retrieveCart(cartId)
    return NextResponse.json({ ok: true, cart })
  } catch {
    // The shipping method is already on the cart. Don't fail checkout if the
    // follow-up cart read times out against Medusa.
    return NextResponse.json({ ok: true })
  }
}

function shippingMethodError(error: unknown): string {
  const err = error as {
    message?: string
    response?: { data?: { message?: string } | string }
  }
  const data = err.response?.data
  if (typeof data === "object" && data?.message) {
    return data.message
  }
  if (typeof data === "string" && data.trim()) {
    return data
  }
  if (err.message && err.message !== "An unknown error occurred") {
    return err.message
  }
  return "Unable to save that shipping option. Please try again."
}
