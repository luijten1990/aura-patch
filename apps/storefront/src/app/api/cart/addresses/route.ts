import { saveCheckoutAddresses } from "@lib/data/cart"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null)

  if (!formData) {
    return NextResponse.json(
      { ok: false, error: "No form data found when setting addresses." },
      { status: 400 }
    )
  }

  try {
    await saveCheckoutAddresses(formData)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error && error.message
            ? error.message
            : "Unable to save that address. Please try again.",
      },
      { status: 400 }
    )
  }
}
