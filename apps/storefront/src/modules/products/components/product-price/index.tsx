import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import {
  SUBSCRIBE_PERCENT,
  subscriptionAmount,
  type PurchaseType,
} from "@lib/util/subscription"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  purchaseType = "subscription",
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  purchaseType?: PurchaseType
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-28 h-7 rounded bg-aura-sage animate-pulse" />
  }

  const normalAmount = selectedPrice.calculated_price_number
  const subscribeNumber = subscriptionAmount(normalAmount)
  const normalPrice = convertToLocale({
    amount: normalAmount,
    currency_code: selectedPrice.currency_code,
  })
  const subscribePrice = convertToLocale({
    amount: subscribeNumber,
    currency_code: selectedPrice.currency_code,
  })
  return (
    <div
      className="grid grid-cols-2 gap-4 text-aura-forest"
      data-purchase-type={purchaseType}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-aura-forest/55">
          Normal
        </p>
        <p className="aura-display mt-1 text-[30px] leading-none">
          {!variant && "From "}
          <span data-testid="product-price" data-value={normalAmount}>
            {normalPrice}
          </span>
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-aura-forest/55">
          Subscribe
        </p>
        <p className="aura-display mt-1 text-[30px] leading-none">
          <span data-testid="subscribe-price" data-value={subscribeNumber}>
            {subscribePrice}
          </span>
          <span className="ml-1 text-[16px] font-sans font-medium">/mo</span>
        </p>
        <p className="mt-1 text-[12px] text-aura-forest/55">
          Save {SUBSCRIBE_PERCENT}%
        </p>
      </div>
    </div>
  )
}
