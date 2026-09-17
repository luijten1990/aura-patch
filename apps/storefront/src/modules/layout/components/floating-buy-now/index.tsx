"use client"

import { addToCart } from "@lib/data/cart"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export default function FloatingBuyNow({
  variantId,
  price,
  disabled,
}: {
  variantId?: string
  price: string
  disabled?: boolean
}) {
  const pathname = usePathname()
  const { countryCode } = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "adding" | "error">("idle")

  if (
    pathname.includes("/cart") ||
    pathname.includes("/checkout") ||
    pathname.includes("/order/") ||
    pathname.includes("/account")
  ) {
    return null
  }

  const buyNow = async () => {
    if (!variantId || disabled || status === "adding") return
    setStatus("adding")
    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode: countryCode as string,
        purchaseType: "subscription",
      })
      router.push(`/${countryCode}/checkout`)
      router.refresh()
    } catch {
      setStatus("error")
      window.setTimeout(() => setStatus("idle"), 2200)
    }
  }

  return (
    <div className="fixed bottom-5 left-5 right-5 z-[65] flex justify-center small:left-auto small:right-7 small:justify-end">
      <button
        type="button"
        onClick={buyNow}
        disabled={disabled || !variantId || status === "adding"}
        className="flex min-h-14 w-full items-center justify-between gap-7 rounded-full border border-aura-cream/25 bg-aura-forest px-7 text-aura-cream shadow-[0_12px_40px_rgba(20,63,53,0.28)] transition-all hover:-translate-y-0.5 hover:bg-aura-gold hover:text-aura-forest disabled:cursor-not-allowed disabled:opacity-60 small:w-auto"
        aria-live="polite"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.17em]">
          {disabled ? "Out of stock" : status === "adding" ? "Preparing checkout…" : status === "error" ? "Please try again" : "Subscribe & save"}
        </span>
        <span className="border-l border-current/25 pl-6 text-[15px] font-semibold">{price}</span>
      </button>
    </div>
  )
}
