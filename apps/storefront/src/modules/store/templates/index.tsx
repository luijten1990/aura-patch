import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import CollectionChooser from "@modules/home/components/collection-chooser"
import IngredientsShowcase from "@modules/home/components/ingredients-showcase"
import AuraProductStage from "@modules/products/components/aura-product-stage"

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
  const featured = response.products.find(
    (product) => product.handle === "aura-patch"
  )
  const corePrice = featured
    ? getProductPrice({ product: featured }).cheapestPrice
    : null

  return (
    <main className="bg-aura-cream text-aura-forest" data-testid="category-container">
      <section className="aura-shell py-8 small:py-12">
        {featured && region ? (
          <AuraProductStage
            product={featured}
            region={region}
            titleTestId="store-page-title"
          />
        ) : (
          <div className="max-w-xl">
            <h1 className="aura-display text-[52px] leading-none" data-testid="store-page-title">
              The Aura Collection
            </h1>
            <p className="mt-6 text-base leading-7 text-aura-forest/75">
              Aura Core is not available in this shop yet. Please check back soon.
            </p>
          </div>
        )}
      </section>
      <CollectionChooser corePrice={corePrice?.calculated_price} />
      <IngredientsShowcase />
    </main>
  )
}

export default StoreTemplate
