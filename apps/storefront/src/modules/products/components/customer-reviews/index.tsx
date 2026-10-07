import Image from "next/image"

import { AURA_REVIEW_COUNT, auraReviews } from "@lib/data/aura-reviews"

const CustomerReviews = ({ featured = true }: { featured?: boolean }) => (
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
      {featured && (
        <p className="text-[14px] text-aura-forest/70">
          <span aria-hidden="true" className="tracking-[0.12em] text-aura-gold">
            ★★★★★
          </span>{" "}
          <span>5/5 · {AURA_REVIEW_COUNT} reviews</span>
        </p>
      )}
    </div>
    {featured ? (
      <div className="mt-6 flex flex-col gap-4">
        {auraReviews.map((review) => (
          <article
            key={`${review.name}-${review.title}`}
            className="grid grid-cols-[88px_1fr] gap-4 border border-aura-forest/15 bg-white/40 p-4"
          >
            <div className="relative h-[88px] w-[88px] overflow-hidden">
              <Image
                src={review.photo}
                alt={review.photoAlt}
                fill
                sizes="88px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-aura-forest">{review.name}</p>
                <span
                  role="img"
                  aria-label="5 out of 5 stars"
                  className="tracking-[0.12em] text-aura-gold"
                >
                  ★★★★★
                </span>
              </div>
              <p className="mt-1 text-[13px] text-aura-forest/60">
                United States
                {review.date && review.dateLabel ? (
                  <>
                    {" "}
                    · <time dateTime={review.date}>{review.dateLabel}</time>
                  </>
                ) : null}
              </p>
              <h3 className="mt-3 text-[16px] font-semibold text-aura-forest">
                {review.title}
              </h3>
              <blockquote className="mt-2 text-[15px] leading-6 text-aura-forest/80">
                “{review.quote}”
              </blockquote>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <p className="mt-4 max-w-2xl text-base leading-7">
        No customer reviews have been published here yet.
      </p>
    )}
    <p className="mt-4 text-[13px] leading-6 text-aura-forest/60">
      Have experience with Aura Core?{" "}
      <a
        className="underline underline-offset-4"
        href="mailto:support@getaurapatch.com?subject=Aura%20Core%20feedback"
      >
        Share your feedback with Aura.
      </a>
    </p>
  </section>
)

export default CustomerReviews
