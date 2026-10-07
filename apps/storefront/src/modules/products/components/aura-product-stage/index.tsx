import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import { auraCore } from "@lib/data/aura-collection"
import { AURA_REVIEW_COUNT } from "@lib/data/aura-reviews"
import CustomerReviews from "@modules/products/components/customer-reviews"
import FormulaPouchNotes from "@modules/products/components/formula-pouch-notes"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"

const pouchImages: HttpTypes.StoreProductImage[] = [
  {
    id: "aura-patch-front",
    url: auraCore.image,
    rank: 0,
  },
  {
    id: "aura-patch-back",
    url: "/images/aura-patch-back-transparent.png",
    rank: 1,
  },
]

type AuraProductStageProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  images?: HttpTypes.StoreProductImage[]
  titleTestId?: string
}

const AuraProductStage = ({
  product,
  region,
  images,
  titleTestId = "product-title",
}: AuraProductStageProps) => {
  return (
    <div
      className="grid items-start gap-8 small:grid-cols-2 small:gap-12"
      data-testid="aura-product-stage"
    >
      <div
        className="self-start small:sticky"
        style={{ top: "6.5rem" }}
      >
        <ImageGallery images={images?.length ? images : pouchImages} />
      </div>

      <div className="flex min-w-0 flex-col gap-8">
        <div>
          <a
            href="#customer-reviews"
            className="inline-flex min-h-11 items-center gap-2 text-[14px] text-aura-forest"
          >
            <span aria-hidden="true" className="tracking-[0.14em] text-aura-gold">
              ★★★★★
            </span>
            <span className="underline decoration-aura-gold decoration-2 underline-offset-4">
              5/5 · {AURA_REVIEW_COUNT} reviews
            </span>
          </a>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-aura-ember">
            {auraCore.use}
          </p>
          <span className="mt-4 aura-spark" />
          <h1
            className="aura-display mt-4 text-[46px] leading-none text-aura-forest small:text-[56px]"
            data-testid={titleTestId}
          >
            {auraCore.name}
          </h1>
          <p className="mt-4 max-w-[36rem] text-[15px] leading-7 text-aura-forest/70">
            {auraCore.description}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-aura-forest/10 bg-white/50 p-5 small:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-aura-forest/55">
            Choose your pouch
          </p>
          <div className="mt-4">
            <Suspense fallback={null}>
              <ProductActions product={product} region={region} />
            </Suspense>
          </div>
        </div>

        <FormulaPouchNotes formula={auraCore} dense />
        <CustomerReviews />
      </div>
    </div>
  )
}

export default AuraProductStage
