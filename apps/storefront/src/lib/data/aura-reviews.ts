export type AuraReview = {
  name: string
  title: string
  date?: string
  dateLabel?: string
  quote: string
  photo?: string
  photoAlt?: string
}

export const auraReviews: AuraReview[] = [
  {
    name: "Sheila Amos",
    title: "I love it",
    date: "2026-05-03",
    dateLabel: "May 3, 2026",
    quote:
      "I love this patch. I peel it on in the morning and wear it through the day. It stays with me while I do housework, and I don't notice it until the end of the day, when the dishes are done.",
    photo: "/images/reviews/review-kitchen.webp",
    photoAlt: "Aura pouch on a kitchen counter next to a cereal bowl and mail",
  },
  {
    name: "Lauren Hayes",
    title: "Pleased I tried it",
    quote:
      "I was skeptical about a patch at first, but I have been pleased. Wearing Aura is a simple daily step, and one pouch covers 30 days.",
  },
  {
    name: "Mark Ellison",
    title: "Easy to pack",
    quote:
      "We put these thin Aura patches on the day before a trip. They peel on easily, and the pouch is simple to take along.",
    photo: "/images/reviews/review-desk.webp",
    photoAlt:
      "Aura pouch on a wood table beside a sticker sheet of six round AURA patches",
  },
  {
    name: "Katie Brennan",
    title: "One daily step",
    quote: "I like having the routine in one patch. Peel, apply, go.",
  },
]

export const AURA_REVIEW_COUNT = auraReviews.length
