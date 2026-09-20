import Image from "next/image"

import { AURA_COLLECTION_EYEBROW, AURA_COLLECTION_LINE, AURA_COLLECTION_SUPPORT, auraCollection } from "@lib/data/aura-collection"

const IngredientsShowcase = () => (
  <div id="ingredients">
  <section id="formulations" className="bg-aura-forest py-16 text-aura-cream small:py-24">
    <div className="aura-shell">
      <div className="grid gap-10 small:grid-cols-[0.9fr_1.1fr] small:items-end">
        <div>
          <p className="aura-eyebrow text-aura-gold">{AURA_COLLECTION_EYEBROW}</p>
          <h2 className="aura-display mt-6 text-[48px] leading-[1.02] tracking-[0.005em] small:text-[62px]">Three formulas.<br />One Aura.</h2>
        </div>
        <p className="max-w-[650px] text-[18px] leading-8 text-aura-cream/75 small:justify-self-end">{AURA_COLLECTION_SUPPORT}</p>
      </div>

      <div className="mt-14 space-y-6">
        {auraCollection.map((product) => (
          <article key={product.key} className="overflow-hidden rounded-[1.75rem] border border-aura-cream/15 bg-[#1a4d42]">
            <div className="grid small:grid-cols-[0.72fr_1.28fr]">
              <div className="relative min-h-[390px] overflow-hidden bg-aura-cream small:min-h-[540px]">
                <Image src={product.image} alt={product.imageAlt} fill className="object-contain p-8" sizes="(max-width: 1023px) 100vw, 38vw" />
                <span className="absolute left-5 top-5 rounded-full bg-aura-forest/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-aura-cream backdrop-blur">
                  {product.status === "available" ? "Available now" : "Coming soon"}
                </span>
              </div>
              <div className="p-6 small:p-9 medium:p-11">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-aura-gold">{product.categories}</p>
                <h3 className="aura-display mt-5 text-[42px] leading-none tracking-[0.01em] small:text-[52px]">{product.name}</h3>
                <p className="mt-3 text-[14px] font-medium uppercase tracking-[0.12em] text-aura-cream/65">{product.subtitle}</p>
                <p className="aura-display mt-8 text-[29px] leading-tight text-aura-gold">{product.tagline}</p>
                <p className="mt-5 max-w-[760px] text-[14px] leading-6 text-aura-cream/72">{product.description}</p>
                <div className="mt-9 border-t border-aura-cream/15 pt-7">
                  <div className="flex items-baseline justify-between gap-5">
                    <h4 className="aura-display text-[28px]">Inside the formula</h4>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-aura-gold">{product.ingredients.length} ingredients</span>
                  </div>
                  <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 medium:grid-cols-3">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={ingredient} className="flex items-start gap-x-2 text-[12px] leading-5 text-aura-cream/75">
                        <span className="w-6 shrink-0 tabular-nums text-aura-gold">{String(index + 1).padStart(2, "0")}</span>
                        <span className="min-w-0">{ingredient}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-[1.25rem] border border-aura-cream/15 px-6 py-5">
        <p className="text-[12px] leading-5 text-aura-cream/60">Product descriptions are general wellness information and are not medical advice. Aura products are not intended to diagnose, treat, cure, or prevent any disease. Ingredient research does not by itself establish the absorption, safety, or effectiveness of a finished transdermal formula.</p>
      </div>
    </div>
  </section>
  </div>
)

export default IngredientsShowcase
