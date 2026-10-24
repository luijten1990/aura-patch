import { retrieveCheckoutCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"
import { CheckoutCartProvider } from "@modules/checkout/components/checkout-cart-provider"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ step?: string | string[] }>
}) {
  const params = await searchParams
  const stepValue = Array.isArray(params.step) ? params.step[0] : params.step
  const step = stepValue || "address"
  const [cart, customer, regions] = await Promise.all([
    retrieveCheckoutCart(),
    retrieveCustomer(),
    listRegions().catch(() => []),
  ])

  if (!cart) {
    return notFound()
  }

  return (
    <div className="content-container py-12 small:py-20">
      <span className="aura-eyebrow text-aura-gold">Secure checkout</span>
      <h1 className="aura-display mt-4 text-[44px] font-normal leading-none small:text-[58px]">
        Checkout
      </h1>
      <CheckoutCartProvider cart={cart}>
        <div className="mt-10 grid grid-cols-1 gap-10 small:grid-cols-[minmax(0,1fr)_380px] small:gap-12">
          <PaymentWrapper cart={cart}>
            <CheckoutForm
              cart={cart}
              customer={customer}
              regions={regions}
              step={step}
            />
          </PaymentWrapper>
          <CheckoutSummary />
        </div>
      </CheckoutCartProvider>
    </div>
  )
}
