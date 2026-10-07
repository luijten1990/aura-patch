export type AuraFormula = {
  key: "core" | "restore" | "energy"
  name: "Aura Core" | "Aura Restore" | "Aura Energy"
  shortName: "Core" | "Restore" | "Energy"
  tagline: string
  use: string
  bestFor: string
  status: "available" | "coming-soon"
  href: string
  image: string
  imageAlt: string
  cardTone: string
  categories: string
  subtitle: string
  description: string
  accent: "ember" | "plum"
  traits: string[]
  ingredients: string[]
  pouchNotes: string[]
}

export const AURA_COLLECTION_EYEBROW = "The Aura Collection"
export const AURA_COLLECTION_LINE = "Three formulas. One Aura."
export const AURA_COLLECTION_SUPPORT =
  "Core, Restore, and Energy — three next-generation daily patches. A slow, considered release of ingredients for all-day support, and a different formula for different moments in the day."

export const auraCollection: AuraFormula[] = [
  {
    key: "core",
    name: "Aura Core",
    shortName: "Core",
    tagline: "Your daily foundation.",
    use: "Daily Wellness",
    bestFor: "Everyday ritual",
    status: "available",
    href: "/products/aura-patch",
    image: "/images/aura-core-front.webp",
    imageAlt: "Aura Core 30-day daily wellness pouch with gold mandala",
    cardTone: "bg-[#dce8e4]",
    categories: "Daily · Balance · Vitality",
    subtitle: "Daily wellness patch",
    description:
      "Aura Core is the everyday Aura ritual: 19 ingredients in one daily patch. Peel, apply, go. Wear for up to 12 hours. A 30-day pouch for days that need a considered baseline.",
    accent: "ember",
    traits: ["Daily Wellness", "Balance", "Vitality"],
    ingredients: [
      "Stabilized Allicin",
      "Organic Ashwagandha",
      "Vitamin C",
      "Zinc Picolinate",
      "Kale",
      "Vitamin A",
      "Ginger",
      "Vitamin D3 + K2",
      "Rhodiola",
      "BCAA + EAA Blend",
      "Holy Basil",
      "NAC",
      "Raspberry Ketones",
      "Ba Ja Tian",
      "Prunella Vulgaris",
      "Lactobacillus casei",
      "Lactobacillus paracasei",
      "Bifidobacterium longum",
      "Lemon Powder",
    ],
    pouchNotes: [
      "30 patches in the pouch. Peel, apply, and wear each one for up to 12 hours.",
      "Vitamin C, zinc, and vitamin A are in the blend for their established roles in normal immune function.",
      "Lactobacillus casei, Lactobacillus paracasei, and Bifidobacterium longum — three named probiotic cultures in the formula.",
      "Stabilized allicin, a garlic-derived botanical, with ginger, a warming root long used in traditional wellness.",
      "Organic ashwagandha and rhodiola, traditional adaptogenic botanicals, inside the 19-ingredient daily ritual.",
    ],
  },
  {
    key: "restore",
    name: "Aura Restore",
    shortName: "Restore",
    tagline: "For recovery & renewal.",
    use: "Recovery & Renewal",
    bestFor: "Quieter, replenishing days",
    status: "coming-soon",
    href: "/#formulations",
    image: "/images/aura-restore-front.webp",
    imageAlt: "Aura Restore 30-day recovery and renewal pouch with gold mandala",
    cardTone: "bg-[#e4eadc]",
    categories: "Recovery · Immune Support · Rejuvenation",
    subtitle: "Recovery & renewal patch",
    description:
      "Aura Restore is a quieter formula for recovery and renewal. Same peel-and-apply patch, same 30-day pouch — arriving soon as part of the collection.",
    accent: "plum",
    traits: ["Recovery", "Immune Support", "Rejuvenation"],
    ingredients: [
      "Organic Ashwagandha",
      "Vitamin C",
      "Ginger",
      "Onion Powder",
      "Wormwood",
      "Cloves",
      "Black Walnut Hull",
      "Milk Thistle",
      "Alpha-Lipoic Acid (ALA)",
      "Electrolytes",
    ],
    pouchNotes: [
      "A 30-day pouch for recovery and renewal. The same peel-and-apply patch, arriving soon.",
      "Set for recovery, immune support, and rejuvenation, with vitamin C included for its established role in normal immune function.",
      "Organic ashwagandha, a traditional adaptogenic botanical, in this quieter blend.",
      "Ginger, a warming root with a long history of traditional wellness use.",
      "Onion, wormwood, cloves, and black walnut hull, with milk thistle, alpha-lipoic acid, and electrolytes in the formula.",
    ],
  },
  {
    key: "energy",
    name: "Aura Energy",
    shortName: "Energy",
    tagline: "For energy & vitality.",
    use: "Energy & Vitality",
    bestFor: "Brighter, more lifted days",
    status: "coming-soon",
    href: "/#formulations",
    image: "/images/aura-energy-front.webp",
    imageAlt: "Aura Energy 30-day energy and vitality pouch with gold mandala",
    cardTone: "bg-[#f3eee6]",
    categories: "Energy · Focus · Stamina",
    subtitle: "Energy & vitality patch",
    description:
      "Aura Energy is a brighter daily ritual for energy and vitality. Same considered patch format, in a 30-day pouch — arriving soon.",
    accent: "ember",
    traits: ["Energy", "Focus", "Stamina"],
    ingredients: [
      "BCAA + EAA Blend",
      "Organic Ashwagandha",
      "Vitamin D3 + K2",
      "Vitamin C",
      "B-Complex",
      "Zinc Picolinate",
      "Glycine",
      "Ginger",
      "Magnesium L-Threonate",
      "Vitamin B6 (Pyridoxine HCl)",
    ],
    pouchNotes: [
      "A 30-day pouch for energy and vitality. The same considered patch, arriving soon.",
      "A BCAA and EAA blend: amino acids the body uses as building blocks.",
      "B-complex, vitamin B6, and vitamin C in the brighter daily blend.",
      "Magnesium L-threonate, glycine, and vitamin D3 with K2.",
      "Organic ashwagandha and ginger, for a formula aimed at energy, focus, and stamina.",
    ],
  },
]

export const auraCore = auraCollection[0]

export const formulaAccentBar = (accent: AuraFormula["accent"]) =>
  accent === "plum" ? "bg-aura-plum" : "bg-aura-ember"

export const formulaAccentText = (accent: AuraFormula["accent"]) =>
  accent === "plum" ? "text-aura-plum" : "text-aura-ember"
