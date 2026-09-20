import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import IngredientsShowcase from "@modules/home/components/ingredients-showcase"
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
          {region ? (
            <PaginatedProducts
              page={1}
              countryCode={countryCode}
              region={region}
              products={response.products}
              count={response.count}
            />
          ) : null}
        </div>
      </section>
      <IngredientsShowcase />
    </main>
  )
}

export default StoreTemplate
