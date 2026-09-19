import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@modules/common/components/ui"
import React, { useContext, useState, type JSX } from "react"

import Radio from "@modules/common/components/radio"

import { isManual } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { confirmStripePayment } from "@lib/util/confirm-stripe-payment"
import { HttpTypes } from "@medusajs/types"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { unstable_rethrow, useParams } from "next/navigation"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
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
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripePaymentContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  cart,
  setError,
  setPaymentComplete,
}: Omit<PaymentContainerProps, "children"> & {
  cart: HttpTypes.StoreCart
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <StripeWalletFields
            cart={cart}
            disabled={disabled}
            setError={setError}
            setPaymentComplete={setPaymentComplete}
          />
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}

const StripeWalletFields = ({
  cart,
  disabled = false,
  setError,
  setPaymentComplete,
}: {
  cart: HttpTypes.StoreCart
  disabled?: boolean
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const { countryCode } = useParams()
  const [expressVisible, setExpressVisible] = useState(false)
  const [expressBusy, setExpressBusy] = useState(false)

  const walletsReady = Boolean(
    cart.email &&
      cart.billing_address &&
      cart.shipping_address &&
      (cart.shipping_methods?.length ?? 0) > 0 &&
      !disabled
  )

  return (
    <div className="my-4 transition-all duration-150 ease-in-out">
      {expressVisible && (
        <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
          Pay faster:
        </Text>
      )}
      <div className={expressVisible ? "mb-1" : "h-0 overflow-hidden"}>
        <ExpressCheckoutElement
          options={{
            emailRequired: true,
            billingAddressRequired: false,
            shippingAddressRequired: false,
            buttonHeight: 44,
            layout: { maxColumns: 2, maxRows: 2, overflow: "auto" },
            paymentMethods: {
              applePay: "always",
              googlePay: "always",
              paypal: "auto",
              link: "auto",
            },
          }}
          onReady={({ availablePaymentMethods }) => {
            setExpressVisible(
              Boolean(
                availablePaymentMethods &&
                  Object.values(availablePaymentMethods).some(Boolean)
              )
            )
          }}
          onClick={({ resolve, reject }) => {
            if (!walletsReady || expressBusy) {
              reject()
              return
            }
            resolve()
          }}
          onCancel={() => setExpressBusy(false)}
          onConfirm={async () => {
            if (!stripe || !elements) {
              setError("Payment is still loading. Try again in a moment.")
              return
            }

            setExpressBusy(true)
            setError(null)

            const result = await confirmStripePayment({
              stripe,
              elements,
              cart,
              countryCode,
            })

            if (!result.authorized) {
              setExpressBusy(false)
              setError(result.message)
              return
            }

            try {
              await placeOrder()
            } catch (err) {
              unstable_rethrow(err)
              setExpressBusy(false)
              setError(err instanceof Error ? err.message : String(err))
            }
          }}
          onLoadError={(e) => {
            setExpressVisible(false)
            setError(e.error?.message ?? "Could not load wallet payments.")
          }}
        />
      </div>
      {expressVisible && (
        <>
          <Text className="mt-2 text-[12px] leading-5 text-aura-forest/55">
            Wallet checkout places your order and accepts the Terms and Privacy
            Policy.
          </Text>
          <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/40">
            <span className="h-px flex-1 bg-aura-forest/15" />
            Or enter details
            <span className="h-px flex-1 bg-aura-forest/15" />
          </div>
        </>
      )}
      <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
        Enter your payment details:
      </Text>
      <PaymentElement
        options={{
          layout: "accordion",
          wallets: {
            applePay: "auto",
            googlePay: "auto",
            link: "auto",
          },
          paymentMethodOrder: [
            "apple_pay",
            "google_pay",
            "paypal",
            "card",
            "link",
          ],
        }}
        onChange={(e) => {
          setError(null)
          setPaymentComplete(e.complete)
        }}
        // Without a handler Stripe.js reports a failed mount as an
        // unhandled "payment Element loaderror" and the option renders
        // blank with no explanation. Surface it in the checkout's own
        // error slot instead.
        onLoadError={(e) => {
          setPaymentComplete(false)
          setError(e.error?.message ?? "Could not load the payment methods.")
        }}
      />
    </div>
  )
}
