import Image from "next/image"

const ingredients = [
  ["Stabilized Allicin", "stabilized-allicin.png", ["Botanical", "Garlic-derived"], "A stabilized garlic-derived compound selected for Aura’s daily wellness blend."],
  ["Organic Ashwagandha", "ashwagandha.png", ["Adaptogen", "Botanical"], "A traditional adaptogenic botanical included in Aura’s whole-body wellness formula."],
  ["Vitamin C", "vitamin-c.png", ["Vitamin", "Antioxidant nutrient"], "An essential nutrient with an established role in normal immune function and antioxidant protection."],
  ["Zinc Picolinate", "zinc-picolinate.png", ["Mineral", "Essential nutrient"], "A form of zinc, an essential mineral that contributes to normal immune function."],
  ["Kale", "kale.png", ["Greens", "Phytonutrients"], "A familiar leafy green selected as part of Aura’s plant-forward ingredient matrix."],
  ["Vitamin A", "vitamin-a.png", ["Vitamin", "Essential nutrient"], "An essential vitamin that contributes to the normal function of the immune system."],
  ["Ginger", "ginger.png", ["Root", "Botanical"], "A warming root botanical with a long history of culinary and traditional wellness use."],
  ["Vitamin D3 + K2", "vitamin-d3-k2.png", ["Vitamins", "Daily wellness"], "Two complementary vitamins selected for Aura’s considered daily nutrient blend."],
  ["Rhodiola", "rhodiola.png", ["Adaptogen", "Root"], "A botanical traditionally used in adaptogenic wellness practices."],
  ["BCAA + EAA Blend", "bcaa-eaa.png", ["Amino acids", "Performance"], "A blend of branched-chain and essential amino acids used as building blocks by the body."],
  ["Holy Basil", "holy-basil.png", ["Adaptogen", "Botanical"], "An aromatic botanical with a long tradition of use in everyday wellness rituals."],
  ["NAC", "nac.png", ["Amino-acid derivative", "Antioxidant pathway"], "N-acetyl cysteine, a compound used by the body in pathways involved in glutathione production."],
  ["Raspberry Ketones", "raspberry-ketones.png", ["Fruit-derived", "Formula blend"], "A raspberry-associated aromatic compound included in the broader botanical matrix."],
  ["Ba Ja Tian", "ba-ja-tian.png", ["Root", "Traditional botanical"], "A traditional root botanical selected as part of Aura’s layered plant blend."],
  ["Prunella Vulgaris", "prunella-vulgaris.png", ["Botanical", "Traditional use"], "A flowering botanical historically used in traditional wellness preparations."],
  ["Lactobacillus casei", "probiotic-blend.png", ["Probiotic", "Culture"], "One of three named probiotic cultures included in Aura’s multi-ingredient formula."],
  ["Lactobacillus paracasei", "probiotic-blend.png", ["Probiotic", "Culture"], "A Lactobacillus culture that forms part of Aura’s probiotic blend."],
  ["Bifidobacterium longum", "probiotic-blend.png", ["Probiotic", "Culture"], "A Bifidobacterium culture included alongside two Lactobacillus strains."],
  ["Lemon Powder", "lemon.png", ["Citrus", "Fruit-derived"], "A citrus-derived powder that completes Aura’s 19-ingredient matrix."],
] as const

export default function AuraIngredientsGallery() {
  return (
    <section id="ingredients" className="bg-aura-forest py-16 text-aura-cream small:py-24">
      <div className="content-container">
        <div className="grid gap-8 small:grid-cols-[0.9fr_1.1fr] small:items-end">
          <div>
            <p className="aura-eyebrow text-aura-gold">Inside Aura</p>
            <h2 className="aura-display mt-5 text-[46px] leading-none small:text-[62px]">Meet all 19 ingredients.</h2>
          </div>
          <p className="max-w-[620px] text-[17px] leading-7 text-aura-cream/70 small:justify-self-end">A closer look at the nutrients, botanicals, adaptogens, amino acids, and probiotic strains inside the daily formula.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 small:grid-cols-3 small:gap-4 medium:grid-cols-4">
          {ingredients.map(([name, file, tags, description], index) => (
            <article key={name} className="group overflow-hidden rounded-[1.25rem] bg-[#f5f0e5] text-aura-forest">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={`/images/ingredients/${file}`} alt={`${name} ingredient`} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" sizes="(max-width: 1023px) 50vw, 25vw" />
                <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-aura-forest text-[10px] text-aura-cream">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="px-4 py-5 small:px-5">
                <h3 className="aura-display text-[21px] leading-[1.08] tracking-[0.01em] small:text-[24px]">{name}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => <span key={tag} className="rounded-full bg-aura-sage px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em]">{tag}</span>)}
                </div>
                <p className="mt-4 text-[12px] leading-5 text-aura-forest/70">{description}</p>
                <details className="group/detail mt-4 border-t border-aura-forest/15 pt-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.15em] text-aura-gold">Ingredient notes <span className="text-lg transition-transform group-open/detail:rotate-45">+</span></summary>
                  <p className="pt-4 text-[12px] leading-5 text-aura-forest/60">This ingredient is one part of Aura’s complete topical formula. Research on an individual ingredient does not establish the absorption or effect of the finished patch.</p>
                </details>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-[920px] text-[11px] leading-5 text-aura-cream/55">Ingredient imagery is illustrative. Product information is provided for general wellness education and is not medical advice or a claim that Aura Patch diagnoses, treats, cures, or prevents any disease.</p>
      </div>
    </section>
  )
}
