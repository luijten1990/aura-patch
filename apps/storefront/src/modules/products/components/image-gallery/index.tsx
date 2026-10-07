"use client"

import type { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

export default function ImageGallery({
  images,
}: {
  images: HttpTypes.StoreProductImage[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = images.find((image) => image.id === selectedId) || images[0]
  const label = (index: number) =>
    index === 0
      ? "Front of pouch"
      : index === 1
        ? "Back label"
        : `Product view ${index + 1}`
  if (!selected) return null

  return (
    <div>
      <div className="relative aspect-[4/5] max-h-[650px] w-full overflow-hidden bg-aura-cream">
        <Image
          key={selected.id}
          src={selected.url}
          alt={label(images.indexOf(selected))}
          fill
          priority={selected.id === images[0]?.id}
          sizes="(max-width: 1024px) 92vw, 600px"
          className="object-contain"
        />
      </div>
      <div
        className="mt-4 flex flex-wrap gap-3"
        role="group"
        aria-label="Product images"
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedId(image.id)}
            aria-pressed={selected.id === image.id}
            className={`min-h-12 rounded-full border px-5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${selected.id === image.id ? "border-aura-forest bg-aura-forest text-aura-cream" : "border-aura-forest/30 text-aura-forest"}`}
          >
            {label(index)}
          </button>
        ))}
      </div>
      {selected.id === "aura-patch-back" && (
        <a
          href={selected.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
        >
          Open full-size label
        </a>
      )}
    </div>
  )
}
