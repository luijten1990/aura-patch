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

  const isSubscribe = purchaseType === "subscription"
  const displayAmount = isSubscribe
    ? subscriptionAmount(selectedPrice.calculated_price_number)
    : selectedPrice.calculated_price_number
  const displayPrice = convertToLocale({
    amount: displayAmount,
    currency_code: selectedPrice.currency_code,
  })

  return (
    <div className="flex flex-col text-aura-forest">
      <span className="aura-display text-[30px]">
        {!variant && "From "}
        <span data-testid="product-price" data-value={displayAmount}>
          {displayPrice}
        </span>
        {isSubscribe && (
          <span className="ml-1 text-[16px] font-sans font-medium">/mo</span>
        )}
      </span>
      {isSubscribe && (
        <p className="mt-1 text-[13px] text-aura-forest/60">
          <span className="line-through">{selectedPrice.calculated_price}</span>
          {" "}Save {SUBSCRIBE_PERCENT}% with auto-renew
        </p>
      )}
    </div>
  )
}
