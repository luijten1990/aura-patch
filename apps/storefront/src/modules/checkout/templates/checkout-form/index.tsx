import { listCartPaymentMethods } from "@lib/data/payment"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { Suspense } from "react"

async function AddressSection({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}) {
  const regions = await listRegions().catch(() => [])

  return <Addresses cart={cart} customer={customer} regions={regions} />
}

async function DeliverySection({ cart }: { cart: HttpTypes.StoreCart }) {
  const shippingMethods = await listCartShippingMethods(cart.id)

  return (
    <Shipping
      cart={cart}
      availableShippingMethods={shippingMethods ?? []}
    />
  )
}

async function PaymentSection({ cart }: { cart: HttpTypes.StoreCart }) {
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  return <Payment cart={cart} availablePaymentMethods={paymentMethods ?? []} />
}

export default function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Suspense
        fallback={
          <div className="py-6 text-[14px] text-aura-forest/55">
            Loading shipping address…
          </div>
        }
      >
        <AddressSection cart={cart} customer={customer} />
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
        <PaymentSection cart={cart} />
      </Suspense>

      <Review cart={cart} />
    </div>
  )
}
