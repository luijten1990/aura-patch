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
    photo: "/images/reviews/review-kitchen-tidy.webp",
    photoAlt: "Aura pouch on a tidy oak kitchen counter beside a ceramic mug and folded linen",
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
    photo: "/images/reviews/review-desk-current.webp",
    photoAlt:
      "Aura pouch on a wood table beside a sticker sheet of six round AURA patches",
  },
  {
    name: "Hillary Ivy",
    title: "They really work",
    quote:
      "I work as a teacher and I am prone to always getting sick, nowadays so many diseases are going round. However ever since I started wearing these I have not had a cold or sore throat, they really work!",
  },
  {
    name: "Amandeep Singh",
    title: "I was skeptical",
    quote:
      "I struggle with a low immune system and always sniffle and cough during flu season, ever since I started wearing these I have not been getting sick! I was skeptical, but they really work!",
  },
  {
    name: "Katie Brennan",
    title: "One daily step",
    quote: "I like having the routine in one patch. Peel, apply, go.",
  },
  {
    name: "Josh Miller",
    title: "They work",
    quote:
      "A friend recommended these to wear in airports during my travels to boost my immune system, they work!",
  },
]

export const AURA_REVIEW_COUNT = auraReviews.length
