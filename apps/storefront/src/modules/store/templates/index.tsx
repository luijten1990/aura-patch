import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import { listProducts } from "@lib/data/products"
import IngredientsShowcase from "@modules/home/components/ingredients-showcase"
import BuyNowButton from "@modules/store/components/buy-now-button"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const { response: featuredResponse } = await listProducts({
    countryCode,
    queryParams: { handle: "aura-patch", limit: 1 },
  })
  const featuredVariant = featuredResponse.products[0]?.variants?.[0]
  const inStock = !!featuredVariant && (
    !featuredVariant.manage_inventory ||
    !!featuredVariant.allow_backorder ||
    (featuredVariant.inventory_quantity ?? 0) > 0
  )

  return (
    <main className="bg-aura-cream text-aura-forest" data-testid="category-container">
      <section className="aura-shell py-14 small:py-20">
        <div className="grid gap-6 border-b border-aura-forest/15 pb-10 small:grid-cols-[1fr_0.7fr] small:items-end">
          <div>
            <p className="aura-eyebrow text-aura-gold">The Aura collection</p>
            <h1
              className="aura-display mt-5 text-[52px] leading-none small:text-[72px]"
              data-testid="store-page-title"
            >
              Shop wellness.
            </h1>
          </div>
          <div className="max-w-[480px] small:justify-self-end">
            <p className="text-[17px] leading-7 text-aura-forest/70">
              Thoughtfully formulated patches designed to make your daily wellness
              ritual beautifully simple.
            </p>
            <BuyNowButton variantId={featuredVariant?.id} disabled={!inStock} />
          </div>
        </div>
        <div className="pt-12">
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            optionValueIds={optionValueIds}
          />
        </Suspense>
        </div>
      </section>
      <IngredientsShowcase />
    </main>
  )
}

export default StoreTemplate
