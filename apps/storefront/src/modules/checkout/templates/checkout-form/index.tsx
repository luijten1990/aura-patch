import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import { CheckoutStepProvider } from "@modules/checkout/components/checkout-step"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default function CheckoutForm({
  cart,
  customer,
  regions,
  step = "address",
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  regions?: HttpTypes.StoreRegion[] | null
  step?: string
}) {
  if (!cart) {
    return null
  }

  return (
    <CheckoutStepProvider initialStep={step}>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <Addresses cart={cart} customer={customer} regions={regions} />
        <Shipping cart={cart} availableShippingMethods={[]} />
        <Payment cart={cart} availablePaymentMethods={[]} />
        <Review cart={cart} />
      </div>
    </CheckoutStepProvider>
  )
}
