import Image from "next/image"

const products = [
  {
    name: "Aura™",
    subtitle: "Daily Wellness & Immune Support Patch",
    categories: "Immune · Defense · Wellness",
    phrase: "Your Daily Defense.",
    description: "Aura™ is a daily optimization patch designed to support immune resilience, antioxidant defenses, and whole-body vitality. Combining stabilized allicin, essential nutrients, botanicals, adaptogens, and probiotics, Aura™ provides comprehensive support for maintaining your body’s natural defenses and staying at your best.",
    image: "/images/aura-patch-front-original.webp",
    status: "Available now",
    ingredients: ["Stabilized Allicin", "Organic Ashwagandha", "Vitamin C", "Zinc Picolinate", "Kale", "Vitamin A", "Ginger", "Vitamin D3 + K2", "Rhodiola", "BCAA + EAA Blend", "Holy Basil", "NAC", "Raspberry Ketones", "Ba Ja Tian", "Prunella Vulgaris", "Lactobacillus casei", "Lactobacillus paracasei", "Bifidobacterium longum", "Lemon Powder"],
  },
  {
    name: "Aura Energy™",
    subtitle: "Cognitive + Energy + Focus + Vitality Support",
    categories: "Focus · Clarity · Energy · Vitality",
    phrase: "Optimize Your Potential.",
    description: "Aura Energy™ is a daily performance patch formulated with amino acids, B vitamins, vitamins, minerals, and botanical extracts to support mental focus, cognitive clarity, energy metabolism, vitality, and everyday performance. Created for people who want to optimize their day, it fits naturally into the routines of biohackers, entrepreneurs, athletes, professionals, and anyone looking to support mental and physical performance.",
    image: "/images/aura-energy-coming-soon.webp",
    status: "Coming soon",
    ingredients: ["BCAA + EAA Blend", "Organic Ashwagandha", "Vitamin D3 + K2", "Vitamin C", "B-Complex", "Zinc Picolinate", "Glycine", "Ginger", "Magnesium L-Threonate", "Vitamin B6 (Pyridoxine HCl)"],
  },
  {
    name: "Aura Recover™",
    subtitle: "Cleanse + Reset + Restore Patch",
    categories: "Cleanse · Reset · Restore",
    phrase: "Get Your Edge Back.",
    description: "Aura Recover™ is a botanical cleanse and recovery patch designed to support natural detoxification, antioxidant defenses, replenishment, and overall restoration—especially when you need a reset after a demanding day or night out.",
    image: "/images/aura-restore-coming-soon.webp",
    status: "Coming soon",
    ingredients: ["Organic Ashwagandha", "Vitamin C", "Ginger", "Onion Powder", "Wormwood", "Cloves", "Black Walnut Hull", "Milk Thistle", "Alpha-Lipoic Acid (ALA)", "Electrolytes"],
  },
]

const IngredientsShowcase = () => (
  <div id="ingredients">
  <section id="formulations" className="bg-aura-forest py-16 text-aura-cream small:py-24">
    <div className="aura-shell">
      <div className="grid gap-10 small:grid-cols-[0.9fr_1.1fr] small:items-end">
        <div>
          <p className="aura-eyebrow text-aura-gold">The Aura formulations</p>
          <h2 className="aura-display mt-6 text-[48px] leading-[1.02] tracking-[0.005em] small:text-[62px]">Three rituals.<br />One considered approach.</h2>
        </div>
        <p className="max-w-[650px] text-[18px] leading-8 text-aura-cream/75 small:justify-self-end">Daily defense, focused performance, and thoughtful recovery—each formula is shaped around a different moment in modern life.</p>
      </div>

      <div className="mt-14 space-y-6">
        {products.map((product, productIndex) => (
          <article key={product.name} className="overflow-hidden rounded-[1.75rem] border border-aura-cream/15 bg-[#1a4d42]">
            <div className="grid small:grid-cols-[0.72fr_1.28fr]">
              <div className="relative min-h-[390px] overflow-hidden bg-[#f5f0e5] small:min-h-[540px]">
                <Image src={product.image} alt={`${product.name} pouch`} fill className={productIndex === 0 ? "object-contain mix-blend-multiply" : "object-cover"} sizes="(max-width: 1023px) 100vw, 38vw" />
                <span className="absolute left-5 top-5 rounded-full bg-aura-forest/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-aura-cream backdrop-blur">{product.status}</span>
              </div>
              <div className="p-6 small:p-9 medium:p-11">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-aura-gold">{product.categories}</p>
                <h3 className="aura-display mt-5 text-[42px] leading-none tracking-[0.01em] small:text-[52px]">{product.name}</h3>
                <p className="mt-3 text-[14px] font-medium uppercase tracking-[0.12em] text-aura-cream/65">{product.subtitle}</p>
                <p className="aura-display mt-8 text-[29px] leading-tight text-aura-gold">{product.phrase}</p>
                <p className="mt-5 max-w-[760px] text-[14px] leading-6 text-aura-cream/72">{product.description}</p>
                <div className="mt-9 border-t border-aura-cream/15 pt-7">
                  <div className="flex items-baseline justify-between gap-5">
                    <h4 className="aura-display text-[28px]">Inside the formula</h4>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-aura-gold">{product.ingredients.length} ingredients</span>
                  </div>
                  <ol className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 medium:grid-cols-3">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={ingredient} className="flex gap-2 text-[12px] leading-5 text-aura-cream/75"><span className="shrink-0 text-aura-gold">{String(index + 1).padStart(2, "0")}</span><span>{ingredient}</span></li>
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
