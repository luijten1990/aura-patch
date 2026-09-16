import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full bg-aura-cream text-aura-forest">
      <header className="sticky top-0 z-50 bg-[#17382f] text-[#f6f0e5]">
        <nav className="content-container flex h-[66px] items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-[12px] uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">Back to cart</span>
            <span className="mt-px block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            data-testid="store-link"
          >
            <span className="relative h-10 w-10 overflow-hidden rounded-full small:h-11 small:w-11">
              <Image
                src="/images/aura-flower-of-life.webp"
                alt=""
                fill
                priority
                className="aura-logo-mark object-cover"
                sizes="44px"
              />
            </span>
            <span className="aura-display text-[16px] leading-[0.9] tracking-[0.13em] text-[#aebfba] small:text-[18px]">
              AURA
              <br />
              <span className="text-[0.65em] tracking-[0.25em]">PATCH</span>
            </span>
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </header>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
