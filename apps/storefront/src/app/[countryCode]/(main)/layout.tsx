import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import WelcomePopup from "@modules/layout/components/welcome-popup"
import FloatingBuyNow from "@modules/layout/components/floating-buy-now"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { subscriptionAmount } from "@lib/util/subscription"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode; params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  const { response: featuredResponse } = await listProducts({
    countryCode,
    queryParams: { handle: "aura-patch", limit: 1 },
  })
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
  const auraInStock = !!auraVariant && (
    !auraVariant.manage_inventory ||
    !!auraVariant.allow_backorder ||
    (auraVariant.inventory_quantity ?? 0) > 0
  )
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      <WelcomePopup />
      {props.children}
      <Footer />
      <FloatingBuyNow variantId={auraVariant?.id} price={auraPrice || "$49.99"} disabled={!auraInStock} />
    </>
  )
}
