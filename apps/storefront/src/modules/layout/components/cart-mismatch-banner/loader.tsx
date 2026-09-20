import { retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartMismatchBanner from "./index"

export default async function CartMismatchBannerLoader({
  customer,
}: {
  customer: HttpTypes.StoreCustomer
}) {
  const cart = await retrieveCart(undefined, "id,customer_id").catch(() => null)

  if (!cart) {
    return null
  }

  return <CartMismatchBanner customer={customer} cart={cart} />
}
