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
  },
]

export const auraCore = auraCollection[0]

export const formulaAccentBar = (accent: AuraFormula["accent"]) =>
  accent === "plum" ? "bg-aura-plum" : "bg-aura-ember"

export const formulaAccentText = (accent: AuraFormula["accent"]) =>
  accent === "plum" ? "text-aura-plum" : "text-aura-ember"
