import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { subscriptionAmount } from "@lib/util/subscription"
import FloatingBuyNow from "./index"

export default async function FloatingBuyNowLoader({
  countryCode,
}: {
  countryCode: string
}) {
  const featuredResponse = await listProducts({
    countryCode,
    queryParams: { handle: "aura-patch", limit: 1 },
  })
    .then(({ response }) => response)
    .catch(() => ({ products: [] }))
  const auraProduct = featuredResponse.products[0]
  const auraVariant = auraProduct?.variants?.[0]
  const auraCheapest = auraProduct
    ? getProductPrice({ product: auraProduct }).cheapestPrice
    : undefined
  const auraPrice = auraCheapest
    ? `${convertToLocale({
        amount: subscriptionAmount(auraCheapest.calculated_price_number),
        currency_code: auraCheapest.currency_code,
      })}/mo`
    : undefined
  const auraInStock =
    !!auraVariant &&
    (!auraVariant.manage_inventory ||
      !!auraVariant.allow_backorder ||
      (auraVariant.inventory_quantity ?? 0) > 0)

  return (
    <FloatingBuyNow
      variantId={auraVariant?.id}
      price={auraPrice || "$49.99"}
      disabled={!auraInStock}
    />
  )
}
