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
  ["/images/reviews/review-kitchen.webp", "Woman in a kitchen wearing a small patch on her shoulder"],
  ["/images/reviews/review-outdoors.webp", "Woman outdoors wearing a small patch on her upper arm"],
  ["/images/reviews/review-desk.webp", "Man at a desk wearing a small patch on his wrist"],
  ["/images/reviews/review-window.webp", "Woman by a window wearing a small patch on her arm"],
  ["/images/reviews/review-portrait.webp", "Man wearing a small patch on his shoulder"],
  ["/images/reviews/review-sidewalk.webp", "Man on a sidewalk wearing a small patch on his upper arm"],
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
    title: "I was sceptical",
    quote:
      "I struggle with a low immune system and always sniffle and cough during flu season, ever since I started wearing these I have not been getting sick! I was sceptical, but they really work!",
  }, 4),
  withPhoto({
    name: "Katie Brennan",
    title: "One daily step",
    quote: "I like having the routine in one patch. Peel, apply, go.",
  }, 0),
  withPhoto({
    name: "Josh Miller",
    title: "I want more of them",
    quote:
      "I want more of them. Peel, apply, and one pouch covers the month. I am ready for the next one.",
  }, 5),
]

export const AURA_REVIEW_COUNT = auraReviews.length
