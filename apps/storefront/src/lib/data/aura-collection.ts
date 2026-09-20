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
  ingredients: string[]
}

export const AURA_COLLECTION_EYEBROW = "The Aura Collection"
export const AURA_COLLECTION_LINE = "Three formulas. One Aura."
export const AURA_COLLECTION_SUPPORT =
  "Three targeted approaches to everyday wellness — same daily ritual, different moments in the day."

export const auraCollection: AuraFormula[] = [
  {
    key: "core",
    name: "Aura Core",
    shortName: "Core",
    tagline: "Your daily foundation.",
    use: "Daily wellness",
    bestFor: "Everyday ritual",
    status: "available",
    href: "/products/aura-patch",
    image: "/images/aura-core-front.webp",
    imageAlt: "Aura Core 30-day wellness pouch",
    cardTone: "bg-[#e7eeea]",
    categories: "Daily · Foundation · Ritual",
    subtitle: "Daily wellness patch",
    description:
      "Aura Core is the everyday Aura ritual: 19 ingredients in one patch, made to peel, apply, and wear for up to 12 hours. A 30-day pouch for the days that simply need a considered baseline.",
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
  },
  {
    key: "restore",
    name: "Aura Restore",
    shortName: "Restore",
    tagline: "Recovery and renewal.",
    use: "Recovery support",
    bestFor: "Quieter, replenishing days",
    status: "coming-soon",
    href: "/#formulations",
    image: "/images/aura-restore-front.webp",
    imageAlt: "Aura Restore 30-day wellness pouch",
    cardTone: "bg-[#e8ece0]",
    categories: "Recovery · Renewal · Restore",
    subtitle: "Recovery & renewal patch",
    description:
      "Aura Restore is a quieter formula for days that ask for replenishment. Same peel-and-apply patch, same 30-day pouch — arriving soon as part of the collection.",
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
  },
  {
    key: "energy",
    name: "Aura Energy",
    shortName: "Energy",
    tagline: "Energy and vitality.",
    use: "Daily energy support",
    bestFor: "Brighter, more lifted days",
    status: "coming-soon",
    href: "/#formulations",
    image: "/images/aura-energy-front.webp",
    imageAlt: "Aura Energy 30-day wellness pouch",
    cardTone: "bg-[#f3efe4] ring-1 ring-aura-forest/15",
    categories: "Energy · Vitality · Daily",
    subtitle: "Energy & vitality patch",
    description:
      "Aura Energy is a brighter daily ritual for ordinary days that need more lift. Same considered patch format, in a 30-day pouch — arriving soon.",
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
  },
]

export const auraCore = auraCollection[0]
