import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import CollectionChooser from "@modules/home/components/collection-chooser"
import IngredientsShowcase from "@modules/home/components/ingredients-showcase"
import AuraProductStage from "@modules/products/components/aura-product-stage"

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
  const corePrice = featured
    ? getProductPrice({ product: featured }).cheapestPrice
    : null
  const showCoreStory = featured?.handle === "aura-patch" && !!region
  const otherProducts = showCoreStory
    ? response.products.filter((product) => product.id !== featured?.id)
    : response.products

  return (
    <main className="bg-aura-cream text-aura-forest" data-testid="category-container">
      <section className="aura-shell py-8 small:py-12">
        {showCoreStory && featured && region ? (
          <AuraProductStage
            product={featured}
            region={region}
            titleTestId="store-page-title"
          />
        ) : (
          <h1 className="aura-display text-[52px] leading-none" data-testid="store-page-title">
            The Aura Collection
          </h1>
        )}
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
