import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@modules/common/components/ui"
import React, { useContext, useState, type JSX } from "react"

import Radio from "@modules/common/components/radio"

import { isManual } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"
import { PaymentElement } from "@stripe/react-stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  hideHeader?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  hideHeader = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "mb-2 flex cursor-pointer flex-col gap-y-2 rounded-[1.25rem] border bg-[#f5efe4] px-6 py-4 text-[14px] text-aura-forest",
        {
          "border-aura-gold":
            selectedPaymentOptionId === paymentProviderId,
          "border-aura-forest/15 hover:border-aura-forest/40":
            selectedPaymentOptionId !== paymentProviderId,
        }
      )}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-x-4">
            <Radio checked={selectedPaymentOptionId === paymentProviderId} />
            <Text className="text-[15px]">
              {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
            </Text>
            {isManual(paymentProviderId) && isDevelopment && (
              <PaymentTest className="hidden small:block" />
            )}
          </div>
          <span className="justify-self-end text-aura-forest">
            {paymentInfoMap[paymentProviderId]?.icon}
          </span>
        </div>
      )}
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

const PAYMENT_OPTION_PLACEHOLDERS = [
  "Card",
  "PayPal",
  "Google Pay",
  "Bank",
]

const PaymentOptionsSkeleton = () => (
  <div className="flex flex-col gap-2">
    {PAYMENT_OPTION_PLACEHOLDERS.map((label) => (
      <div
        key={label}
        className="flex h-14 items-center justify-between rounded-xl border border-aura-forest/10 bg-white px-4"
      >
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full border border-aura-forest/25" />
          <span className="text-[14px] text-aura-forest/80">{label}</span>
        </div>
        <span className="h-3 w-12 animate-pulse rounded bg-aura-forest/10" />
      </div>
    ))}
  </div>
)

export const StripePaymentContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setError,
  setPaymentComplete,
}: Omit<PaymentContainerProps, "children" | "hideHeader"> & {
  cart?: HttpTypes.StoreCart
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)
  const selected = selectedPaymentOptionId === paymentProviderId

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
      hideHeader={selected}
    >
      {selected &&
        (stripeReady ? (
          <StripePaymentMethods
            setError={setError}
            setPaymentComplete={setPaymentComplete}
          />
        ) : (
          <div className="my-1">
            <PaymentOptionsSkeleton />
          </div>
        ))}
    </PaymentContainer>
  )
}

const StripePaymentMethods = ({
  setError,
  setPaymentComplete,
}: {
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
}) => {
  const [methodsReady, setMethodsReady] = useState(false)

  return (
    <div className="relative my-1 min-h-[232px]">
      {!methodsReady && (
        <div className="absolute inset-0 z-10 bg-[#f5efe4]">
          <PaymentOptionsSkeleton />
        </div>
      )}
      <PaymentElement
        options={{
          layout: {
            type: "accordion",
            radios: true,
            spacedAccordionItems: true,
          },
          wallets: {
            applePay: "auto",
            googlePay: "auto",
            link: "auto",
          },
          paymentMethodOrder: [
            "card",
            "paypal",
            "google_pay",
            "apple_pay",
            "link",
          ],
        }}
        onReady={() => setMethodsReady(true)}
        onChange={(e) => {
          setError(null)
          setPaymentComplete(e.complete)
        }}
        onLoadError={(e) => {
          setMethodsReady(true)
          setPaymentComplete(false)
          setError(e.error?.message ?? "Could not load the payment methods.")
        }}
      />
    </div>
  )
}
