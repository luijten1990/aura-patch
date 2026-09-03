"use client"

import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function BuyNowButton({
  variantId,
  disabled,
}: {
  variantId?: string
  disabled?: boolean
}) {
  const { countryCode } = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "adding" | "error">("idle")

  const buyNow = async () => {
    if (!variantId || disabled || status === "adding") return

    setStatus("adding")
    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode: countryCode as string,
      })
      router.push(`/${countryCode}/checkout`)
      router.refresh()
    } catch {
      setStatus("error")
      window.setTimeout(() => setStatus("idle"), 2200)
    }
  }

  return (
    <button
      type="button"
      onClick={buyNow}
      disabled={disabled || !variantId || status === "adding"}
      className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-aura-gold px-8 text-[11px] font-bold uppercase tracking-[0.16em] text-aura-forest transition-colors hover:bg-aura-forest hover:text-aura-cream disabled:cursor-not-allowed disabled:opacity-50"
      aria-live="polite"
    >
      {disabled
        ? "Out of stock"
        : status === "adding"
        ? "Preparing checkout…"
        : status === "error"
        ? "Please try again"
        : "Buy now"}
    </button>
  )
}
