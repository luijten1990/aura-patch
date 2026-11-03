import Image from "next/image"

const ingredients = [
  ["Stabilized Allicin", "stabilized-allicin.png", ["Botanical", "Garlic-derived"], "A stabilized garlic-derived compound selected for Aura’s daily wellness blend."],
  ["Organic Ashwagandha", "ashwagandha.png", ["Adaptogen", "Botanical"], "A traditional adaptogenic botanical included in Aura’s whole-body wellness formula."],
  ["Vitamin C", "vitamin-c.png", ["Vitamin", "Immune basics"], "Included to support healthy immune function."],
  ["Zinc Picolinate", "zinc-picolinate.png", ["Mineral", "Immune basics"], "A form of zinc, included to support healthy immune function."],
  ["Kale", "kale.png", ["Greens", "Phytonutrients"], "A familiar leafy green selected as part of Aura’s plant-forward ingredient matrix."],
  ["Vitamin A", "vitamin-a.png", ["Vitamin", "Immune basics"], "Included to support healthy immune function."],
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

        <div className="mt-12 flex flex-col gap-10">
          {([
            ["Immune basics", ["Vitamin C", "Zinc Picolinate", "Vitamin A"]],
            ["Probiotic cultures", ["Lactobacillus casei", "Lactobacillus paracasei", "Bifidobacterium longum"]],
            ["Adaptogens", ["Organic Ashwagandha", "Rhodiola", "Holy Basil"]],
            ["Amino acids", ["BCAA + EAA Blend", "NAC"]],
            ["Botanicals and other nutrients", ["Stabilized Allicin", "Ginger", "Kale", "Vitamin D3 + K2", "Ba Ja Tian", "Prunella Vulgaris", "Raspberry Ketones", "Lemon Powder"]],
          ] as [string, string[]][]).map(([group, names]) => (
          <div key={group}>
            <h3 className="aura-display text-[28px] text-aura-cream">{group}</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 small:grid-cols-3 small:gap-4 medium:grid-cols-4">
          {ingredients.filter(([name]) => names.includes(name)).map(([name, file, tags, description]) => (
            <article key={name} className="group overflow-hidden rounded-[1.25rem] bg-[#f5f0e5] text-aura-forest">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={`/images/ingredients/${file.replace(".png", ".webp")}`} alt={`${name} ingredient`} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" sizes="(max-width: 1023px) 50vw, 25vw" quality={75} />
                <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-aura-forest text-[10px] text-aura-cream">{String(ingredients.findIndex(([item]) => item === name) + 1).padStart(2, "0")}</span>
              </div>
              <div className="px-4 py-5 small:px-5">
                <h3 className="aura-display text-[21px] leading-[1.08] tracking-[0.01em] small:text-[24px]">{name}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => <span key={tag} className="rounded-full bg-aura-sage px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em]">{tag}</span>)}
                </div>
                <p className="mt-4 text-[12px] leading-5 text-aura-forest/70">{description}</p>
              </div>
            </article>
          ))}
            </div>
          </div>
          ))}
        </div>

        <p className="mt-8 max-w-[920px] text-[13px] leading-6 text-aura-cream/70">Research on individual ingredients doesn't establish how the finished patch is absorbed or what effect it has. Amounts per patch are printed on the pouch. Ingredient imagery is illustrative.</p>
      </div>
    </section>
  )
}
