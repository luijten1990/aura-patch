import { auraCore } from "@lib/data/aura-collection"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import CollectionChooser from "@modules/home/components/collection-chooser"
import IngredientsShowcase from "@modules/home/components/ingredients-showcase"
import CustomerReviews from "@modules/products/components/customer-reviews"
import FormulaPouchNotes from "@modules/products/components/formula-pouch-notes"
import ProductPreview from "@modules/products/components/product-preview"
import BuyNowButton from "@modules/store/components/buy-now-button"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  countryCode,
}: {
  countryCode: string
}) => {
  const [region, { response }] = await Promise.all([
    getRegion(countryCode),
    listProducts({
      countryCode,
      queryParams: { limit: 12 },
    }),
  ])
  const featured =
    response.products.find((product) => product.handle === "aura-patch") ||
    response.products[0]
  const featuredVariant = featured?.variants?.[0]
  const inStock = !!featuredVariant && (
    !featuredVariant.manage_inventory ||
    !!featuredVariant.allow_backorder ||
    (featuredVariant.inventory_quantity ?? 0) > 0
  )

  const corePrice = featured
    ? getProductPrice({ product: featured }).cheapestPrice
    : null
  const showCoreStory = featured?.handle === "aura-patch"
  const otherProducts = showCoreStory
    ? response.products.filter((product) => product.id !== featured?.id)
    : response.products

  return (
    <main className="bg-aura-cream text-aura-forest" data-testid="category-container">
      <section className="aura-shell py-14 small:py-20">
        <div className="grid gap-6 border-b border-aura-forest/15 pb-10 small:grid-cols-[1fr_0.7fr] small:items-end">
          <div>
            <p className="aura-eyebrow text-aura-gold">The Aura Collection</p>
            <span className="mt-5 aura-spark" />
            <h1
              className="aura-display mt-5 text-[52px] leading-none small:text-[72px]"
              data-testid="store-page-title"
            >
              Three formulas. One Aura.
            </h1>
          </div>
          <div className="max-w-[480px] small:justify-self-end">
            <p className="text-[17px] leading-7 text-aura-forest/70">
              Core for everyday, Restore for replenishing days, Energy for a
              brighter ritual. Start with Core — Restore and Energy are next.
            </p>
            <BuyNowButton variantId={featuredVariant?.id} disabled={!inStock} />
          </div>
        </div>
        {showCoreStory && region && featured ? (
          <div
            className="grid items-start gap-10 pt-12 small:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] small:gap-14"
            data-testid="store-product-story"
          >
            <ProductPreview product={featured} region={region} />
            <div className="flex flex-col gap-12 small:border-l small:border-aura-forest/10 small:pl-10">
              <FormulaPouchNotes formula={auraCore} />
              <CustomerReviews />
            </div>
          </div>
        ) : null}
        {region && otherProducts.length > 0 ? (
          <div className="pt-12">
            <PaginatedProducts
              page={1}
              countryCode={countryCode}
              region={region}
              products={otherProducts}
              count={otherProducts.length}
            />
          </div>
        ) : null}
      </section>
      <CollectionChooser corePrice={corePrice?.calculated_price} />
      <IngredientsShowcase />
    </main>
  )
}

export default StoreTemplate
