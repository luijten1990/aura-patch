"use client"

import { Button, Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5">
      <Heading
        level="h2"
        className="aura-display text-[38px] font-normal leading-none"
      >
        Order summary
      </Heading>
      <DiscountCode cart={cart} variant="aura" />
      <Divider className="border-aura-forest/15" />
      <CartTotals totals={cart} variant="aura" />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="min-h-12 w-full rounded-full !bg-aura-gold px-6 text-[11px] font-bold uppercase tracking-[0.16em] !text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream">
          Go to checkout
        </Button>
      </LocalizedClientLink>
      <p className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-aura-forest/45">
        Secure checkout · Free standard shipping
      </p>
    </div>
  )
}

export default Summary
