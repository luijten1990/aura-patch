import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { Suspense } from "react"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const [shippingMethods, paymentMethods, regions] = await Promise.all([
    listCartShippingMethods(cart.id),
    listCartPaymentMethods(cart.region?.id ?? ""),
    listRegions().catch(() => []),
  ])

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} regions={regions} />

      <Suspense fallback={null}>
        <Shipping
          cart={cart}
          availableShippingMethods={shippingMethods ?? []}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Payment cart={cart} availablePaymentMethods={paymentMethods ?? []} />
      </Suspense>

      <Suspense fallback={null}>
        <Review cart={cart} />
      </Suspense>
    </div>
  )
}
