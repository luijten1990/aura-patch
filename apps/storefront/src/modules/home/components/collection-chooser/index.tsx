import {
  AURA_COLLECTION_EYEBROW,
  AURA_COLLECTION_LINE,
  AURA_COLLECTION_SUPPORT,
  auraCollection,
  formulaAccentBar,
  formulaAccentText,
} from "@lib/data/aura-collection"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type CollectionChooserProps = {
  corePrice?: string | null
}

const CollectionChooser = ({ corePrice }: CollectionChooserProps) => (
  <section id="collection" className="aura-shell py-16 small:py-24">
    <div className="flex flex-col gap-8 small:flex-row small:items-end small:justify-between">
      <div>
        <p className="aura-eyebrow text-aura-gold">{AURA_COLLECTION_EYEBROW}</p>
        <span className="mt-5 aura-spark" />
        <h2 className="aura-display mt-6 max-w-[760px] text-[50px] leading-none small:text-[64px]">
          {AURA_COLLECTION_LINE}
        </h2>
      </div>
      <p className="max-w-[430px] text-[17px] leading-7 text-aura-forest/70">
        {AURA_COLLECTION_SUPPORT}
      </p>
    </div>

    <div className="mt-14 grid gap-6 small:grid-cols-3">
      {auraCollection.map((formula) => {
        const available = formula.status === "available"
        return (
          <article
            key={formula.key}
            className={`${formula.cardTone} overflow-hidden rounded-[2rem] border border-aura-forest/10`}
          >
            <div className="relative aspect-[4/5] bg-aura-cream">
              {!available && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-aura-cream/90 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-aura-forest backdrop-blur">
                  Coming soon
                </span>
              )}
              <Image
                src={formula.image}
                alt={formula.imageAlt}
                fill
                className="object-contain p-7 transition-transform duration-700 hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-col gap-4 px-7 pb-8 pt-1">
              <p className={`text-[11px] uppercase tracking-[0.18em] ${formulaAccentText(formula.accent)}`}>{formula.use}</p>
              <h3 className="aura-display text-[34px] leading-none">{formula.name}</h3>
              <span className={`block h-px w-10 ${formulaAccentBar(formula.accent)}`} />
              <p className="aura-display text-[22px] leading-tight text-aura-forest/80">{formula.tagline}</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {formula.traits.map((trait) => (
                  <li key={trait} className="text-[10px] uppercase tracking-[0.16em] text-aura-forest/50">
                    {trait}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] leading-6 text-aura-forest/65">
                30 patches · {formula.use}
              </p>
              {available ? (
                <div className="mt-2 flex flex-col gap-3">
                  {corePrice && (
                    <p className="text-[15px] font-semibold">{corePrice}</p>
                  )}
                  <LocalizedClientLink href={formula.href} className="aura-button text-center">
                    Explore {formula.shortName}
                  </LocalizedClientLink>
                </div>
              ) : (
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-aura-forest/45">
                  Coming soon
                </p>
              )}
            </div>
          </article>
        )
      })}
    </div>

    <div id="compare" className="mt-16 overflow-hidden rounded-[1.75rem] border border-aura-forest/10">
      <div className="border-b border-aura-forest/10 px-7 py-8 small:px-10">
        <p className="aura-eyebrow text-aura-gold">Not sure which Aura is right for you?</p>
        <h3 className="aura-display mt-4 text-[32px] leading-none small:text-[40px]">Compare all three.</h3>
      </div>
      <div className="grid small:grid-cols-3">
        {auraCollection.map((formula, index) => (
          <div
            key={formula.key}
            className={`px-7 py-8 small:px-10 ${index < auraCollection.length - 1 ? "border-b border-aura-forest/10 small:border-b-0 small:border-r" : ""}`}
          >
            <p className={`text-[11px] uppercase tracking-[0.18em] ${formulaAccentText(formula.accent)}`}>{formula.shortName}</p>
            <span className={`mt-3 block h-px w-8 ${formulaAccentBar(formula.accent)}`} />
            <p className="aura-display mt-4 text-[26px] leading-none">{formula.tagline}</p>
            <p className="mt-4 text-[14px] leading-6 text-aura-forest/65">Best for: {formula.bestFor}</p>
            <p className="mt-2 text-[14px] leading-6 text-aura-forest/65">30-day pouch</p>
            {formula.status === "available" ? (
              <LocalizedClientLink
                href={formula.href}
                className="mt-6 inline-flex text-[11px] font-bold uppercase tracking-[0.16em] underline decoration-aura-ember decoration-2 underline-offset-8"
              >
                Shop {formula.shortName}
              </LocalizedClientLink>
            ) : (
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-aura-forest/40">Coming soon</p>
            )}
          </div>
        ))}
      </div>
    </div>

    <p className="mt-8 text-center text-[13px] text-aura-forest/55">
      Want the formulas in more detail?{" "}
      <a href="#formulations" className="underline decoration-aura-gold decoration-2 underline-offset-4">
        See what is inside each one
      </a>
    </p>
  </section>
)

export default CollectionChooser
