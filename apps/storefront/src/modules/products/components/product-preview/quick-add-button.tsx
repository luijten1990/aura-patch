"use client"

import { addLineItemRequest } from "@lib/util/cart-client"
import { useParams } from "next/navigation"
import { useRef, useState } from "react"

export default function QuickAddButton({
  variantId,
  disabled,
}: {
  variantId?: string
  disabled?: boolean
}) {
  const { countryCode } = useParams()
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle")
  const addingRef = useRef(false)

  const handleAdd = async () => {
    if (!variantId || disabled || addingRef.current) return

    addingRef.current = true
    setStatus("adding")
    try {
      await addLineItemRequest({
        variantId,
        quantity: 1,
        countryCode: countryCode as string,
        purchaseType: "subscription",
      })
      setStatus("added")
      addingRef.current = false
      window.setTimeout(() => setStatus("idle"), 1800)
    } catch {
      addingRef.current = false
      setStatus("error")
      window.setTimeout(() => setStatus("idle"), 2200)
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled || !variantId || status === "adding"}
      className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-aura-wine px-6 text-[11px] font-bold uppercase tracking-[0.15em] text-aura-cream transition-colors hover:bg-aura-forest hover:text-aura-cream disabled:cursor-not-allowed disabled:opacity-50"
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
