import { Suspense } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { auraCore } from "@lib/data/aura-collection"
import { auraCoreReviewSummary } from "@lib/data/aura-reviews"
import CustomerReviews from "@modules/products/components/customer-reviews"
import FormulaPouchNotes from "@modules/products/components/formula-pouch-notes"
import ProductActions from "@modules/products/components/product-actions"

type AuraProductStageProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  titleTestId?: string
}

const AuraProductStage = ({
  product,
  region,
  titleTestId = "product-title",
}: AuraProductStageProps) => {
  return (
    <div
      className="grid items-start gap-8 small:grid-cols-2 small:gap-12"
      data-testid="aura-product-stage"
    >
      <div className="small:sticky small:top-24">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f6f0e6]">
          <Image
            src={auraCore.image}
            alt={auraCore.imageAlt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-contain p-6 small:p-10"
          />
        </div>
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
              {auraCoreReviewSummary.rating}/5 · {auraCoreReviewSummary.count} reviews
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
