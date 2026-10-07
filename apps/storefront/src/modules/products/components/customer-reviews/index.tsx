import Image from "next/image"

import {
  auraCoreReviewSummary,
  auraCoreReviews,
} from "@lib/data/aura-reviews"

const formatReviewDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`))

const CustomerReviews = () => (
  <section
    id="customer-reviews"
    aria-labelledby="customer-reviews-title"
    data-testid="customer-reviews"
    className="scroll-mt-24"
  >
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 id="customer-reviews-title" className="aura-display text-[32px] leading-none">
        Customer reviews
      </h2>
      <p className="text-[14px] text-aura-forest/70">
        <span aria-hidden="true" className="tracking-[0.12em] text-aura-gold">
          ★★★★★
        </span>{" "}
        <span>
          {auraCoreReviewSummary.rating}/5 · {auraCoreReviewSummary.count} reviews
        </span>
      </p>
    </div>
    <div className="mt-6 flex flex-col gap-4">
      {auraCoreReviews.map((review) => (
        <article
          key={review.id}
          className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border border-aura-forest/15 bg-white/40 p-4"
          aria-label={`Review by ${review.name}`}
        >
          <div className="relative aspect-square overflow-hidden bg-aura-cream">
            <Image
              src={review.image}
              alt={review.imageAlt}
              fill
              sizes="88px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-aura-forest">{review.name}</p>
              <span
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
                className="tracking-[0.12em] text-aura-gold"
              >
                {"★".repeat(review.rating)}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-aura-forest/60">
              {review.location}
              {review.date ? ` · ${formatReviewDate(review.date)}` : ""}
            </p>
            <h3 className="mt-3 text-[17px] font-semibold leading-snug">
              {review.title}
            </h3>
            <blockquote className="mt-2 text-[15px] leading-7 text-aura-forest/75">
              “{review.body}”
            </blockquote>
          </div>
        </article>
      ))}
    </div>
  </section>
)

export default CustomerReviews
