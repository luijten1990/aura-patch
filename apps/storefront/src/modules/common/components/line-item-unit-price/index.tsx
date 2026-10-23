import { lineItemAmount } from "@lib/util/cart-money"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const total = lineItemAmount(item)
  const original_total = item.original_total ?? total
  const hasReducedPrice = total < original_total
  const quantity = item.quantity || 1

  const percentage_diff = original_total
    ? Math.round(((original_total - total) / original_total) * 100)
    : 0

  return (
    <div className="flex h-full flex-col justify-center font-sans text-aura-forest/55">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="font-sans text-aura-forest/55">Original: </span>
            )}
            <span
              className="font-sans text-aura-forest/45 line-through"
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: original_total / quantity,
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="font-sans text-aura-forest">-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className="font-sans text-[15px] font-medium leading-6 text-aura-forest"
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: total / quantity,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
