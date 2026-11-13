import Image from "next/image"
import { auraCore } from "@lib/data/aura-collection"

const notes: Record<string, { short: string; file?: string; tags: string[]; description: string }> = {
  "Stabilized Allicin (from Allium Sativum)": { short: "Stabilized Allicin", file: "stabilized-allicin.webp", tags: ["Botanical", "Garlic-derived"], description: "A stabilized garlic-derived compound selected for Aura’s daily wellness blend." },
  "Vitamin C (Ascorbic Acid)": { short: "Vitamin C", file: "vitamin-c.webp", tags: ["Vitamin", "Essential nutrient"], description: "An essential nutrient with an established role in normal immune function." },
  "Vitamin B2 (Riboflavin)": { short: "Vitamin B2", tags: ["Vitamin", "B vitamin"], description: "Riboflavin, listed on the pouch as vitamin B2 in the daily blend." },
  "Broccoli Sprout Extract": { short: "Broccoli Sprout Extract", file: "broccoli-sprouts.webp", tags: ["Botanical", "Plant extract"], description: "A broccoli sprout extract included in the daily botanical blend." },
  "BCAA+EAA blend (L-Leucine, L-Valine, L-Isoleucine, L-Lysine, L-Phenylalanine, L-Threonine, L-Methionine, L-Histidine, L-Tryptophan)": { short: "BCAA+EAA blend", file: "bcaa-eaa.webp", tags: ["Amino acids", "Blend"], description: "A blend of branched-chain and essential amino acids, named in full on the pouch." },
  "Quercetin": { short: "Quercetin", tags: ["Plant compound", "Formula blend"], description: "A plant-derived compound included in the daily blend." },
  "Electrolytes (from Sodium Chloride)": { short: "Electrolytes", file: "electrolytes.webp", tags: ["Mineral", "Electrolyte"], description: "Sodium chloride, listed on the pouch as the source of the electrolytes." },
  "Ginger Extract": { short: "Ginger Extract", file: "ginger.webp", tags: ["Root", "Botanical"], description: "A ginger extract from a root with a long history of culinary and traditional wellness use." },
  "Zinc Picolinate": { short: "Zinc Picolinate", file: "zinc-picolinate.webp", tags: ["Mineral", "Essential nutrient"], description: "A form of zinc, an essential mineral that contributes to normal immune function." },
  "Hawthorn Berry Powder": { short: "Hawthorn Berry Powder", tags: ["Berry", "Botanical"], description: "A hawthorn berry powder included in the daily botanical blend." },
  "Tea Tree Powder": { short: "Tea Tree Powder", file: "tea-tree.webp", tags: ["Leaf", "Botanical"], description: "A tea tree powder included in the daily botanical blend." },
  "Vitamin E (Mixed Tocopherols)": { short: "Vitamin E", tags: ["Vitamin", "Essential nutrient"], description: "Vitamin E, listed on the pouch as mixed tocopherols." },
  "Raspberry Ketones": { short: "Raspberry Ketones", file: "raspberry-ketones.webp", tags: ["Fruit-derived", "Formula blend"], description: "A raspberry-associated compound included in the daily blend." },
  "Vitamin D3 (Cholecalciferol)": { short: "Vitamin D3", file: "vitamin-d3-k2.webp", tags: ["Vitamin", "Daily wellness"], description: "Vitamin D3, listed on the pouch as cholecalciferol." },
  "Vitamin K2 (Menaquinone-7)": { short: "Vitamin K2", file: "vitamin-d3-k2.webp", tags: ["Vitamin", "Daily wellness"], description: "Vitamin K2, listed on the pouch as menaquinone-7." },
  "Bacillus Subtilis": { short: "Bacillus Subtilis", file: "probiotic-blend.webp", tags: ["Culture", "Named strain"], description: "A named bacterial culture listed on the pouch with the other cultures." },
  "Bifidobacterium Longum": { short: "Bifidobacterium Longum", file: "probiotic-blend.webp", tags: ["Culture", "Named strain"], description: "A Bifidobacterium culture named on the pouch." },
  "Lactobacillus Casei": { short: "Lactobacillus Casei", file: "probiotic-blend.webp", tags: ["Culture", "Named strain"], description: "A Lactobacillus culture named on the pouch." },
  "Lactobacillus Paracasei": { short: "Lactobacillus Paracasei", file: "probiotic-blend.webp", tags: ["Culture", "Named strain"], description: "A Lactobacillus culture named on the pouch." },
  "Lactobacillus Acidophilus": { short: "Lactobacillus Acidophilus", file: "probiotic-blend.webp", tags: ["Culture", "Named strain"], description: "A Lactobacillus culture named on the pouch." },
  "Vitamin A (Retinyl Palmitate)": { short: "Vitamin A", file: "vitamin-a.webp", tags: ["Vitamin", "Essential nutrient"], description: "An essential vitamin that contributes to the normal function of the immune system." },
}

export default function AuraIngredientsGallery() {
  return (
    <section id="ingredients" className="bg-aura-forest py-16 text-aura-cream small:py-24">
      <div className="content-container">
        <div className="grid gap-8 small:grid-cols-[0.9fr_1.1fr] small:items-end">
          <div>
            <p className="aura-eyebrow text-aura-gold">Inside Aura</p>
            <h2 className="aura-display mt-5 text-[46px] leading-none small:text-[62px]">Meet all {auraCore.ingredients.length} ingredients.</h2>
          </div>
          <p className="max-w-[620px] text-[17px] leading-7 text-aura-cream/70 small:justify-self-end">A closer look at the nutrients, botanicals, amino acids, and named cultures inside the daily formula. Names match the pouch.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 small:grid-cols-3 small:gap-4 medium:grid-cols-4">
          {auraCore.ingredients.map((name, index) => {
            const note = notes[name]
            return (
            <article key={name} className="group overflow-hidden rounded-[1.25rem] bg-[#f5f0e5] text-aura-forest">
              <div className="relative aspect-[4/3] overflow-hidden bg-aura-sage">
                {note?.file ? (
                  <Image src={`/images/ingredients/${note.file}`} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" sizes="(max-width: 1023px) 50vw, 25vw" quality={75} />
                ) : null}
                <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-aura-forest text-[10px] text-aura-cream">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="px-4 py-5 small:px-5">
                <h3 className="aura-display text-[21px] leading-[1.08] tracking-[0.01em] small:text-[24px]">{note?.short ?? name}</h3>
                {note && note.short !== name ? <p className="mt-2 text-[11px] leading-4 text-aura-forest/55">{name}</p> : null}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {note?.tags.map((tag) => <span key={tag} className="rounded-full bg-aura-sage px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em]">{tag}</span>)}
                </div>
                <p className="mt-4 text-[12px] leading-5 text-aura-forest/70">{note?.description}</p>
                <details className="group/detail mt-4 border-t border-aura-forest/15 pt-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.15em] text-aura-gold">Ingredient notes <span className="text-lg transition-transform group-open/detail:rotate-45">+</span></summary>
                  <p className="pt-4 text-[12px] leading-5 text-aura-forest/60">This ingredient is one part of Aura’s complete topical formula. Research on an individual ingredient does not establish the absorption or effect of the finished patch.</p>
                </details>
              </div>
            </article>
            )
          })}
        </div>

        <p className="mt-8 max-w-[920px] text-[11px] leading-5 text-aura-cream/55">Ingredient imagery is illustrative. Product information is provided for general wellness education and is not medical advice or a claim that Aura Patch diagnoses, treats, cures, or prevents any disease.</p>
      </div>
    </section>
  )
}
