import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Investor Relations | Aura Patch",
  description: "Learn about Aura Patch's recurring-revenue wellness platform and download the investor presentation.",
}

const highlights = [
  ["5+ years", "Founder-led development"],
  ["19 ingredients", "Flagship daily-wellness formula"],
  ["30 patches", "A considered monthly ritual"],
  ["$500K-$1.5M", "Strategic seed capital sought"],
]

export default function InvestorsPage() {
  return (
    <main className="bg-aura-cream text-aura-forest">
      <section className="aura-shell grid gap-12 py-14 small:grid-cols-[0.9fr_1.1fr] small:items-center small:py-24">
        <div className="max-w-[670px]">
          <p className="aura-eyebrow text-aura-gold">Investor Relations</p>
          <h1 className="aura-display mt-6 text-[54px] leading-[0.94] small:text-[76px]">
            Building the next daily wellness ritual.
          </h1>
          <p className="mt-7 max-w-[590px] text-[17px] leading-8 text-aura-forest/70">
            Aura Patch is developing a recurring-revenue wellness platform around
            beautifully simple, daily-use patches and a growing family of targeted formulations.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/downloads/aura-patch-investor-deck.pdf" download className="aura-button inline-flex">
              Download investor deck
            </a>
            <a href="mailto:support@getaurapatch.com?subject=Aura%20Patch%20Investor%20Inquiry" className="inline-flex min-h-12 items-center justify-center rounded-full border border-aura-forest/25 px-7 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors hover:bg-aura-forest hover:text-aura-cream">
              Investor inquiries
            </a>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[2rem] bg-aura-sage/50">
          <Image src="/images/ambassador-create.png" alt="Aura Patch branded pouch in a premium lifestyle setting" fill priority className="object-cover" sizes="(max-width: 1024px) 90vw, 520px" />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-forest/55 via-transparent to-transparent" />
          <p className="absolute bottom-7 left-7 right-7 aura-display text-[34px] leading-none text-aura-cream">Wellness designed for modern life.</p>
        </div>
      </section>

      <section className="bg-aura-forest py-16 text-aura-cream small:py-24">
        <div className="aura-shell">
          <p className="aura-eyebrow text-aura-gold">At a glance</p>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-aura-cream/15 small:grid-cols-4">
            {highlights.map(([value, label]) => (
              <article key={value} className="bg-aura-forest px-7 py-10 small:min-h-[220px] small:px-8 small:py-12">
                <p className="aura-display text-[38px] leading-none text-aura-gold">{value}</p>
                <div className="mt-8 h-px w-10 bg-aura-cream/35" />
                <p className="mt-5 text-[14px] leading-6 text-aura-cream/65">{label}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-[900px] text-[11px] leading-5 text-aura-cream/50">
            Information on this page and in the presentation includes illustrative assumptions and forward-looking statements. It is not an offer to sell securities or a guarantee of future performance.
          </p>
        </div>
      </section>
    </main>
  )
}
