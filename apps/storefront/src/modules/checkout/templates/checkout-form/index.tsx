import { listCartPaymentMethods } from "@lib/data/payment"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { Suspense } from "react"

async function DeliverySection({ cart }: { cart: HttpTypes.StoreCart }) {
  const shippingMethods = await listCartShippingMethods(cart.id)

  return (
    <Shipping
      cart={cart}
      availableShippingMethods={shippingMethods ?? []}
    />
  )
}

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

  const [paymentMethods, regions] = await Promise.all([
    listCartPaymentMethods(cart.region?.id ?? ""),
    listRegions().catch(() => []),
  ])

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Suspense fallback={null}>
        <Addresses cart={cart} customer={customer} regions={regions} />
      </Suspense>

      <Suspense
        fallback={
          <div className="py-6 text-[14px] text-aura-forest/55">
            Loading delivery options…
          </div>
        }
      >
        <DeliverySection cart={cart} />
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
