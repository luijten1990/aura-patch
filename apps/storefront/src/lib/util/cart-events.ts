import type { HttpTypes } from "@medusajs/types"

export const CART_EVENT = "aura:cart"
export type CartEventDetail =
  | { status: "adding" }
  | { status: "updated"; cart: HttpTypes.StoreCart }
  | { status: "error"; message: string }

export function notifyCart(detail: CartEventDetail) {
  window.dispatchEvent(new CustomEvent<CartEventDetail>(CART_EVENT, { detail }))
}
