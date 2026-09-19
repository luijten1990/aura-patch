"use client"

import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PayPalPaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const PayPalPaymentButton: React.FC<PayPalPaymentButtonProps> = (props) => {
  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <ErrorMessage
        error="PayPal is missing its storefront client ID."
        data-testid="paypal-payment-error-message"
      />
    )
  }

  return <PayPalPaymentButtonInner {...props} />
}

const PayPalPaymentButtonInner: React.FC<PayPalPaymentButtonProps> = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [{ isResolved }] = usePayPalScriptReducer()

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending"
  )

  const getPayPalOrderId = (): string | null => {
    if (!paymentSession?.data) {
      return null
    }

    return (
      (paymentSession.data.order_id as string) ||
      (paymentSession.data.id as string) ||
      null
    )
  }

  const createOrder = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    const existingOrderId = getPayPalOrderId()

    if (!existingOrderId) {
      const message =
        "PayPal is not ready yet. Return to Payment and choose PayPal again."
      setErrorMessage(message)
      setSubmitting(false)
      throw new Error(message)
    }

    return existingOrderId
  }

  const onApprove = async () => {
    setSubmitting(true)
    setErrorMessage(null)
    await placeOrder().catch((err) => {
      setErrorMessage(err.message)
      setSubmitting(false)
    })
  }

  if (!isResolved) {
    return (
      <Button disabled size="large" isLoading className="rounded-full" data-testid={dataTestId}>
        Loading PayPal
      </Button>
    )
  }

  return (
    <>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          setErrorMessage(
            (err?.message as string) || "PayPal could not complete this payment."
          )
          setSubmitting(false)
        }}
        onCancel={() => {
          setSubmitting(false)
          setErrorMessage("PayPal payment was cancelled.")
        }}
        style={{
          layout: "vertical",
          color: "gold",
          shape: "pill",
          label: "paypal",
        }}
        disabled={notReady || submitting}
      />
      <ErrorMessage
        error={errorMessage}
        data-testid="paypal-payment-error-message"
      />
    </>
  )
}

export default PayPalPaymentButton
