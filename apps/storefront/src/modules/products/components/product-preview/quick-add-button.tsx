"use client"

import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function QuickAddButton({
  variantId,
  disabled,
}: {
  variantId?: string
  disabled?: boolean
}) {
  const { countryCode } = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle")

  const handleAdd = async () => {
    if (!variantId || disabled || status === "adding") return

    setStatus("adding")
    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode: countryCode as string,
        purchaseType: "subscription",
      })
      setStatus("added")
      router.refresh()
      window.setTimeout(() => setStatus("idle"), 1800)
    } catch {
      setStatus("error")
      window.setTimeout(() => setStatus("idle"), 2200)
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled || !variantId || status === "adding"}
      className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-aura-gold px-6 text-[11px] font-bold uppercase tracking-[0.15em] text-aura-forest transition-colors hover:bg-aura-forest hover:text-aura-cream disabled:cursor-not-allowed disabled:opacity-50"
      aria-live="polite"
    >
      {disabled
        ? "Out of stock"
        : status === "adding"
        ? "Adding…"
        : status === "added"
        ? "Added to cart"
        : status === "error"
        ? "Please try again"
        : "Add to cart"}
    </button>
  )
}
