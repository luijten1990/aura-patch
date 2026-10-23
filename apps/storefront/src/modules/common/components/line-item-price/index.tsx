import { lineItemAmount } from "@lib/util/cart-money"
import { getPercentageDiff } from "@lib/util/get-percentage-diff"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const currentPrice = lineItemAmount(item)
  const originalPrice = item.original_total ?? currentPrice
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col items-end gap-x-2 font-sans text-aura-forest/55">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="font-sans text-aura-forest/55">Original: </span>
              )}
              <span
                className="font-sans text-aura-forest/45 line-through"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="font-sans text-aura-forest">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className="font-sans text-[15px] font-semibold leading-6 text-aura-forest"
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
