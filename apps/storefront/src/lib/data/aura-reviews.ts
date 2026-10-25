export type AuraReview = {
  name: string
  title: string
  date?: string
  dateLabel?: string
  quote: string
  photo: string
  photoAlt: string
}

const photos = [
  ["/images/reviews/review-kitchen.webp", "Aura pouch on a kitchen counter next to a cereal bowl and mail"],
  ["/images/reviews/review-outdoors.webp", "Hand holding an Aura pouch in a car"],
  ["/images/reviews/review-desk.webp", "Aura pouch on a wood table beside a sticker sheet of six round AURA patches"],
  ["/images/reviews/review-window.webp", "Bathroom mirror photo of a woman holding an Aura pouch"],
  ["/images/reviews/review-portrait.webp", "Hand holding an open Aura pouch filled with sticker sheets of six round AURA patches"],
  ["/images/reviews/review-sidewalk.webp", "Woman holding a closed Aura pouch in a hallway"],
  ["/images/reviews/review-living-room.webp", "Back of an Aura pouch on a bedspread, showing the ingredient panel"],
] as const

const withPhoto = (
  review: Omit<AuraReview, "photo" | "photoAlt">,
  index: number
): AuraReview => ({
  ...review,
  photo: photos[index % photos.length][0],
  photoAlt: photos[index % photos.length][1],
})

export const auraReviews: AuraReview[] = [
  withPhoto({
    name: "Sheila Amos",
    title: "I love it",
    date: "2026-05-03",
    dateLabel: "May 3, 2026",
    quote:
      "I love this patch. I peel it on in the morning and wear it through the day. It stays with me while I do housework, and I don't notice it until the end of the day, when the dishes are done.",
  }, 0),
  withPhoto({
    name: "Lauren Hayes",
    title: "Pleased I tried it",
    quote:
      "I was skeptical about a patch at first, but I have been pleased. Wearing Aura is a simple daily step, and one pouch covers 30 days.",
  }, 1),
  withPhoto({
    name: "Mark Ellison",
    title: "Easy to pack",
    quote:
      "We put these thin Aura patches on the day before a trip. They peel on easily, and the pouch is simple to take along.",
  }, 2),
  withPhoto({
    name: "Hillary Ivy",
    title: "They really work",
    quote:
      "I work as a teacher and I am prone to always getting sick, nowadays so many diseases are going round. However ever since I started wearing these I have not had a cold or sore throat, they really work!",
  }, 3),
  withPhoto({
    name: "Amandeep Singh",
    title: "I was skeptical",
    quote:
      "I struggle with a low immune system and always sniffle and cough during flu season, ever since I started wearing these I have not been getting sick! I was skeptical, but they really work!",
  }, 4),
  withPhoto({
    name: "Katie Brennan",
    title: "One daily step",
    quote: "I like having the routine in one patch. Peel, apply, go.",
  }, 6),
  withPhoto({
    name: "Josh Miller",
    title: "They work",
    quote:
      "A friend recommended these to wear in airports during my travels to boost my immune system, they work!",
  }, 5),
]

export const AURA_REVIEW_COUNT = auraReviews.length
