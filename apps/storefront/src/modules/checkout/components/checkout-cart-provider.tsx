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

let publishedCart: HttpTypes.StoreCart | null = null
const listeners = new Set<(cart: HttpTypes.StoreCart) => void>()

function publishCheckoutCart(cart: HttpTypes.StoreCart) {
  publishedCart = cart
  listeners.forEach((listener) => listener(cart))
}

export function CheckoutCartProvider({
  cart,
  children,
}: {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}) {
  const [liveCart, setLiveCart] = useState(cart)

  useEffect(() => {
    setLiveCart(cart)
    publishCheckoutCart(cart)
  }, [cart])

  const setCart = (next: HttpTypes.StoreCart) => {
    setLiveCart(next)
    publishCheckoutCart(next)
  }

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

export function useCheckoutCart(fallback?: HttpTypes.StoreCart) {
  const context = useContext(CheckoutCartContext)
  const [cart, setLocalCart] = useState(
    context?.cart || publishedCart || fallback || null
  )

  useEffect(() => {
    const listener = (next: HttpTypes.StoreCart) => setLocalCart(next)
    listeners.add(listener)
    if (publishedCart) {
      setLocalCart(publishedCart)
    }
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const setCart = (next: HttpTypes.StoreCart) => {
    if (context) {
      context.setCart(next)
      return
    }
    publishCheckoutCart(next)
    setLocalCart(next)
  }

  return {
    cart: context?.cart || cart || fallback,
    setCart,
  }
}
