"use client"
import { RadioGroup } from "@headlessui/react"
import { isPaypal, isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { listCartPaymentMethods } from "@lib/data/payment"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripePaymentContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import {
  Button,
  Container,
  Heading,
  Text,
  clx,
} from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { useCheckoutCart } from "../checkout-cart-provider"
import { useCheckoutStep } from "../checkout-step"

const Payment = ({
  cart: _cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const { cart: liveCart, setCart } = useCheckoutCart(_cart)
  const cart = liveCart || _cart
  const { step, setStep } = useCheckoutStep()
  const [methods, setMethods] = useState(availablePaymentMethods)
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const isOpen = step === "payment"

  useEffect(() => {
    if (methods.length) {
      return
    }
    const regionId = cart.region?.id || cart.region_id || ""
    if (!regionId) {
      return
    }
    let cancelled = false
    listCartPaymentMethods(regionId).then((result) => {
      if (!cancelled && result?.length) {
        setMethods(result)
      }
    })
    return () => {
      cancelled = true
    }
  }, [cart.region?.id, cart.region_id, methods.length])

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method) || isPaypal(method)) {
      try {
        const session = await initiatePaymentSession(cart, {
          provider_id: method,
        })
        if (session?.payment_collection && cart) {
          setCart({
            ...cart,
            payment_collection: session.payment_collection,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    }
  }

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) || paidByGiftcard

  const handleEdit = () => {
    setStep("payment")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputPaymentDetails =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        const session = await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
        if (session?.payment_collection && cart) {
          setCart({
            ...cart,
            payment_collection: session.payment_collection,
          })
        }
      }

      if (!shouldInputPaymentDetails || isPaypal(selectedPaymentMethod)) {
        setStep("review")
        return
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div>
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className={clx(
            "aura-display flex flex-row items-baseline gap-x-2 text-[32px] font-normal leading-none",
            {
              "pointer-events-none select-none opacity-50":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55 underline decoration-aura-gold decoration-2 underline-offset-4 transition-colors hover:text-aura-forest"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        {/*
          Keep Stripe's iframe in the document after moving to review. Hiding it
          with `display: none` can cause Stripe to unregister the Payment
          Element, leaving `confirmPayment` without an element to confirm.
          The off-screen layout keeps it mounted while removing it from both
          the visual flow and the accessibility tree.
        */}
        <div
          className={
            isOpen
              ? "block"
              : "absolute h-px w-px overflow-hidden opacity-0 pointer-events-none"
          }
          aria-hidden={!isOpen}
        >
          {isOpen && !paidByGiftcard && !methods.length && (
            <p className="text-[14px] leading-6 text-aura-forest/55">
              Loading payment options…
            </p>
          )}
          {!paidByGiftcard && methods.length > 0 && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {methods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripePaymentContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setError={setError}
                        setPaymentComplete={setPaymentComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                Payment method
              </Text>
              <Text
                className="text-[14px] leading-6 text-aura-forest/70"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6 rounded-full !bg-aura-wine px-7 text-[12px] font-semibold uppercase tracking-[0.12em] !text-aura-cream hover:!bg-aura-forest hover:!text-aura-cream"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !paymentComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeLike(selectedPaymentMethod)
              ? "Enter payment details"
              : "Continue to review"}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                  Payment method
                </Text>
                <Text
                  className="text-[14px] leading-6 text-aura-forest/70"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                  Payment details
                </Text>
                <div
                  className="flex items-center gap-2 text-[14px] leading-6 text-aura-forest/70"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex h-7 w-fit items-center border border-aura-forest/15 bg-[#f5efe4] p-2">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>Another step will appear</Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                Payment method
              </Text>
              <Text
                className="text-[14px] leading-6 text-aura-forest/70"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8 border-aura-forest/15" />
    </div>
  )
}

export default Payment
