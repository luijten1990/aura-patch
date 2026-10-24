"use client"

import { createContext, useCallback, useContext, useState } from "react"

type CheckoutStepContextValue = {
  step: string
  setStep: (step: string) => void
}

const CheckoutStepContext = createContext<CheckoutStepContextValue | null>(null)

export function CheckoutStepProvider({
  initialStep,
  children,
}: {
  initialStep: string
  children: React.ReactNode
}) {
  const [step, setStepState] = useState(initialStep || "address")
  // Keep the step in memory. Updating the query string makes Next.js refetch
  // the checkout page, which is the wait this flow is trying to avoid.
  const setStep = useCallback((next: string) => {
    setStepState(next)
  }, [])

  return (
    <CheckoutStepContext.Provider value={{ step, setStep }}>
      {children}
    </CheckoutStepContext.Provider>
  )
}

export function useCheckoutStep() {
  const context = useContext(CheckoutStepContext)
  if (!context) {
    throw new Error("Checkout step is only available inside checkout.")
  }
  return context
}
