export type AuraReview = {
  id: string
  name: string
  title: string
  body: string
  location: string
  date?: string
  rating: 5
  image: string
  imageAlt: string
}

export const auraCoreReviews: AuraReview[] = [
  {
    id: "sheila-amos",
    name: "Sheila Amos",
    title: "I love it",
    body: "I love this patch. I peel it on in the morning and wear it through the day. It stays with me while I do housework, and I don't notice it until the end of the day, when the dishes are done.",
    location: "United States",
    date: "2026-05-03",
    rating: 5,
    image: "/images/reviews/wear-shoulder.webp",
    imageAlt: "Person wearing an Aura patch on the shoulder",
  },
  {
    id: "pleased-i-tried-it",
    name: "Customer",
    title: "Pleased I tried it",
    body: "I was skeptical about a patch at first, but I have been pleased. Wearing Aura is a simple daily step, and one pouch covers 30 days.",
    location: "United States",
    rating: 5,
    image: "/images/reviews/wear-day.webp",
    imageAlt: "Person wearing an Aura patch outdoors",
  },
  {
    id: "easy-to-pack",
    name: "Customer",
    title: "Easy to pack",
    body: "We put these thin Aura patches on the day before a trip. They peel on easily, and the pouch is simple to take along.",
    location: "United States",
    rating: 5,
    image: "/images/reviews/wear-desk.webp",
    imageAlt: "Person wearing an Aura patch while at a desk",
  },
  {
    id: "hillary-ivy",
    name: "Hillary Ivy",
    title: "Part of a long day",
    body: "I wear Aura on long days. Peel, apply, and it stays in place while I get on with the day.",
    location: "United States",
    rating: 5,
    image: "/images/reviews/wear-rest.webp",
    imageAlt: "Person resting while wearing an Aura patch",
  },
  {
    id: "amandeep-singh",
    name: "Amandeep Singh",
    title: "Easy monthly pouch",
    body: "I have been using the 30-day pouch. Peel, apply, and wear it for up to 12 hours. It is an easy part of the month.",
    location: "United States",
    rating: 5,
    image: "/images/reviews/wear-close.webp",
    imageAlt: "Close view of an Aura patch worn on the shoulder",
  },
  {
    id: "one-daily-step",
    name: "Customer",
    title: "One daily step",
    body: "I like having the routine in one patch. Peel, apply, go.",
    location: "United States",
    rating: 5,
    image: "/images/reviews/wear-shoulder.webp",
    imageAlt: "Person wearing an Aura patch on the shoulder",
  },
  {
    id: "i-want-more",
    name: "Customer",
    title: "I want more",
    body: "I want more of them.",
    location: "United States",
    rating: 5,
    image: "/images/reviews/wear-day.webp",
    imageAlt: "Person wearing an Aura patch outdoors",
  },
]

export const auraCoreReviewSummary = {
  rating: 5,
  count: auraCoreReviews.length,
}
