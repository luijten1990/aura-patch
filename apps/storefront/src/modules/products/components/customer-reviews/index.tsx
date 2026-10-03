"use client"

import { auraReviews } from "@lib/data/aura-reviews"
import Image from "next/image"
import { useRef } from "react"

export default function CustomerReviews({ featured }: { featured: boolean }) {
  const scroller = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: number) => {
    const element = scroller.current
    const card = element?.querySelector("article")
    if (!element || !card) {
      return
    }
    element.scrollBy({
      left: direction * (card.clientWidth + 16),
      behavior: "smooth",
    })
  }

  return (
    <section
      id="customer-reviews"
      aria-labelledby="customer-reviews-title"
      className="content-container scroll-mt-24 border-t border-aura-forest/15 py-12"
    >
      <div className="flex items-end justify-between gap-4">
        <h2 id="customer-reviews-title" className="aura-display text-[36px]">
          Customer reviews
        </h2>
        {featured && (
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-aura-forest/25 text-lg"
              aria-label="Previous review"
              onClick={() => scrollByCard(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-aura-forest/25 text-lg"
              aria-label="Next review"
              onClick={() => scrollByCard(1)}
            >
              ›
            </button>
          </div>
        )}
      </div>
      {featured ? (
        <div
          ref={scroller}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar pb-2"
        >
          {auraReviews.map((review) => (
            <article
              key={`${review.name}-${review.title}`}
              className="w-[280px] shrink-0 snap-start border border-aura-forest/20 bg-white/30"
              aria-label={`Review by ${review.name}`}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={review.photo}
                  alt={review.photoAlt}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{review.name}</p>
                  <span
                    role="img"
                    aria-label="5 out of 5 stars"
                    className="tracking-[0.12em] text-aura-forest"
                  >
                    ★★★★★
                  </span>
                </div>
                <p className="mt-2 text-sm text-aura-forest/70">
                  United States
                  {review.date && review.dateLabel ? (
                    <>
                      {" "}
                      · <time dateTime={review.date}>{review.dateLabel}</time>
                    </>
                  ) : null}
                </p>
                <h3 className="mt-4 text-lg font-semibold">{review.title}</h3>
                <blockquote className="mt-2 text-base leading-7">“{review.quote}”</blockquote>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 max-w-2xl text-base leading-7">
          No customer reviews have been published here yet.
        </p>
      )}
      <p className="mt-3 max-w-2xl text-sm leading-7">
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
}
