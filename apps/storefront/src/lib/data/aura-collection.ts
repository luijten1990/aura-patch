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
  benefits: AuraBenefit[]
}

export type AuraBenefit = {
  title: string
  body: string
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
    benefits: [
      {
        title: "A patch for the whole day",
        body: "Peel, apply, and wear it for up to 12 hours. The pouch holds 30 patches, one for each day of the ritual.",
      },
      {
        title: "Daily wellness, balance, and vitality",
        body: "Aura Core is 19 ingredients in one daily patch, for days that need a considered baseline.",
      },
      {
        title: "Nutrients known for normal immune function",
        body: "Vitamin C, zinc, and vitamin A are in the blend for their established roles in normal immune function.",
      },
      {
        title: "Three probiotic cultures, named",
        body: "Lactobacillus casei, Lactobacillus paracasei, and Bifidobacterium longum are part of the formula.",
      },
      {
        title: "Botanicals with a long traditional use",
        body: "Stabilized allicin, a garlic-derived botanical, sits with ginger, a warming root. Organic ashwagandha and rhodiola are traditional adaptogenic botanicals in the same pouch.",
      },
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
    benefits: [
      {
        title: "A quieter 30-day pouch",
        body: "The same peel-and-apply patch, set for recovery and renewal. Arriving soon.",
      },
      {
        title: "Recovery, immune support, and rejuvenation",
        body: "Those are the three traits of this blend. Vitamin C is included for its established role in normal immune function.",
      },
      {
        title: "Ashwagandha in a quieter formula",
        body: "Organic ashwagandha, a traditional adaptogenic botanical, is part of Restore.",
      },
      {
        title: "Ginger, a warming root",
        body: "Ginger is included for its long history of culinary and traditional wellness use.",
      },
      {
        title: "A replenishing botanical blend",
        body: "Onion, wormwood, cloves, and black walnut hull, with milk thistle, alpha-lipoic acid, and electrolytes in the formula.",
      },
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
    benefits: [
      {
        title: "A brighter 30-day pouch",
        body: "The same considered patch, aimed at energy and vitality. Arriving soon.",
      },
      {
        title: "Energy, focus, and stamina",
        body: "Aura Energy is the brighter daily ritual, set for those three traits.",
      },
      {
        title: "Amino acids the body uses as building blocks",
        body: "A BCAA and EAA blend is in the formula.",
      },
      {
        title: "B vitamins in the daily blend",
        body: "B-complex, vitamin B6, and vitamin C are part of the brighter pouch.",
      },
      {
        title: "Magnesium, glycine, and vitamins D3 with K2",
        body: "Magnesium L-threonate, glycine, and vitamin D3 with K2 sit alongside organic ashwagandha and ginger.",
      },
    ],
  },
]

export const auraCore = auraCollection[0]

export const formulaAccentBar = (accent: AuraFormula["accent"]) =>
  accent === "plum" ? "bg-aura-plum" : "bg-aura-ember"

export const formulaAccentText = (accent: AuraFormula["accent"]) =>
  accent === "plum" ? "text-aura-plum" : "text-aura-ember"
