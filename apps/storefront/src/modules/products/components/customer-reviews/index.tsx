"use client"

import Image from "next/image"
import { useRef } from "react"

const photos = [
  {
    src: "/images/reviews/wear-shoulder.webp",
    alt: "Person wearing an Aura patch on the shoulder",
  },
  {
    src: "/images/reviews/wear-day.webp",
    alt: "Person wearing an Aura patch outdoors",
  },
  {
    src: "/images/reviews/wear-desk.webp",
    alt: "Person wearing an Aura patch while at a desk",
  },
  {
    src: "/images/reviews/wear-rest.webp",
    alt: "Person resting while wearing an Aura patch",
  },
  {
    src: "/images/reviews/wear-close.webp",
    alt: "Close view of an Aura patch worn on the shoulder",
  },
]

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
          <article
            className="w-[280px] shrink-0 snap-start border border-aura-forest/20 bg-white/30"
            aria-label="Review by Sheila Amos"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">Sheila Amos</p>
                <span role="img" aria-label="5 out of 5 stars" className="tracking-[0.12em] text-aura-forest">
                  ★★★★★
                </span>
              </div>
              <p className="mt-2 text-sm text-aura-forest/70">
                United States · <time dateTime="2026-05-03">May 3, 2026</time>
              </p>
              <h3 className="mt-4 text-lg font-semibold">I love it</h3>
              <blockquote className="mt-2 text-base leading-7">“I love this patch.”</blockquote>
              <p className="mt-4 text-xs text-aura-forest/60">Featured review excerpt.</p>
            </div>
          </article>
          {photos.slice(1).map((photo) => (
            <article
              key={photo.src}
              className="w-[220px] shrink-0 snap-start border border-aura-forest/20 bg-white/30"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image src={photo.src} alt={photo.alt} fill sizes="220px" className="object-cover" />
              </div>
              <p className="p-4 text-xs leading-5 text-aura-forest/60">
                Aura patch, worn through the day.
              </p>
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
