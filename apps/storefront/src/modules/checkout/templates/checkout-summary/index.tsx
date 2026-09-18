import { withCartMoney } from "@lib/util/cart-money"
import { Heading } from "@modules/common/components/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="sticky top-[78px] flex flex-col-reverse gap-y-8 py-8 small:flex-col small:py-0">
      <div className="flex w-full flex-col rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] p-6 small:p-8">
        <Heading
          level="h2"
          className="aura-display text-[32px] font-normal leading-none small:text-[38px]"
        >
          In your cart
        </Heading>
        <div className="mt-6">
          <CartTotals totals={withCartMoney(cart)} variant="aura" />
        </div>
        <ItemsPreviewTemplate cart={cart} />
        <div className="mt-6">
          <DiscountCode cart={cart} variant="aura" />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
