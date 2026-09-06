import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const footerLinks = [
  ["Home", "/"],
  ["Shop", "/store"],
  ["Wholesale", "/wholesale"],
  ["Ambassadors", "/ambassadors"],
  ["Investor Relations", "/investors"],
  ["Ingredients", "/#ingredients"],
  ["Science", "/#science"],
  ["FAQ", "/#faq"],
  ["Account", "/account"],
  ["Cart", "/cart"],
  ["Privacy Policy", "/privacy"],
  ["Terms of Service", "/terms"],
  ["Accessibility", "/accessibility"],
]

export default function Footer() {
  return (
    <footer className="bg-aura-forest text-aura-cream">
      <div className="aura-shell py-16 small:py-24">
        <div className="grid gap-14 small:grid-cols-[1.3fr_0.7fr]">
          <div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-4"
            >
              <span className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src="/images/aura-flower-of-life.webp"
                  alt=""
                  fill
                  className="aura-logo-mark object-cover"
                  sizes="64px"
                />
              </span>
              <span className="aura-display text-[27px] leading-[0.9] tracking-[0.13em] text-[#aebfba]">
                AURA<br /><span className="text-[0.65em] tracking-[0.25em]">PATCH</span>
              </span>
            </LocalizedClientLink>
            <p className="mt-6 max-w-[480px] text-[16px] leading-7 text-aura-cream/65">
              A beautifully simple daily wellness ritual, thoughtfully designed
              for modern life.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm uppercase tracking-[0.12em]">
            {footerLinks.map(([label, href]) => (
              <LocalizedClientLink
                key={label}
                href={href}
                className={`transition-colors hover:text-aura-gold ${label === "Investor Relations" ? "font-bold text-aura-gold" : ""}`}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>
        <div className="mt-20 flex flex-col gap-4 border-t border-aura-cream/20 pt-6 text-xs uppercase tracking-[0.12em] text-aura-cream/50 small:flex-row small:items-center small:justify-between">
          <span>© {new Date().getFullYear()} Aura Patch</span>
          <span>Daily wellness, simplified</span>
        </div>
      </div>
    </footer>
  )
}
