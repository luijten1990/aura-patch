"use client"

import { HttpTypes } from "@medusajs/types"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type CheckoutCartContextValue = {
  cart: HttpTypes.StoreCart
  setCart: (cart: HttpTypes.StoreCart) => void
}

const CheckoutCartContext = createContext<CheckoutCartContextValue | null>(null)

export function CheckoutCartProvider({
  cart,
  children,
}: {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}) {
  const [liveCart, setCart] = useState(cart)

  useEffect(() => {
    setCart(cart)
  }, [cart])

  const value = useMemo(
    () => ({ cart: liveCart, setCart }),
    [liveCart]
  )

  return (
    <CheckoutCartContext.Provider value={value}>
      {children}
    </CheckoutCartContext.Provider>
  )
}

export function useCheckoutCart() {
  const value = useContext(CheckoutCartContext)
  if (!value) {
    throw new Error("Checkout cart is not available")
  }
  return value
}
