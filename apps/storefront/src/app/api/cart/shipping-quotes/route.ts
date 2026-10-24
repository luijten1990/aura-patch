import { getCartId } from "@lib/data/cookies"
import { listCheckoutCarrierQuotes } from "@lib/data/fulfillment"
import { NextRequest, NextResponse } from "next/server"

function text(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max)
}

export async function POST(req: NextRequest) {
  const cartId = await getCartId()
  if (!cartId) {
    return NextResponse.json({ quotes: {} }, { status: 400 })
  }

  const body = (await req.json().catch(() => null)) as { shipping_address?: Record<string, unknown> } | null
  const source = body?.shipping_address
  if (!source) {
    return NextResponse.json({ quotes: {} }, { status: 400 })
  }

  const shippingAddress = {
    address_1: text(source.address_1, 120),
    address_2: text(source.address_2, 120),
    city: text(source.city, 80),
    province: text(source.province, 40),
    postal_code: text(source.postal_code, 16),
    country_code: text(source.country_code, 2).toLowerCase(),
    first_name: text(source.first_name, 40),
    last_name: text(source.last_name, 40),
    company: text(source.company, 80),
    phone: text(source.phone, 32),
  }

  if (
    shippingAddress.address_1.length < 5 ||
    shippingAddress.city.length < 2 ||
    shippingAddress.postal_code.length < 4 ||
    shippingAddress.country_code.length !== 2
  ) {
    return NextResponse.json({ quotes: {} })
  }

  const quotes = await listCheckoutCarrierQuotes(cartId, shippingAddress)
  return NextResponse.json({ quotes })
}
