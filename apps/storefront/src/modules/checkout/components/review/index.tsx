"use client"

import { Heading, Text, clx } from "@modules/common/components/ui"

import PaymentButton from "../payment-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

const Review = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div>
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className={clx(
            "aura-display flex flex-row items-baseline gap-x-2 text-[32px] font-normal leading-none",
            {
              "pointer-events-none select-none opacity-50": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="mb-6 flex w-full items-start gap-x-1">
            <div className="w-full">
              <Text className="text-[14px] leading-7 text-aura-forest/70">
                By placing your order, you confirm that you have read and accept
                our{" "}
                <LocalizedClientLink
                  href="/terms"
                  className="underline decoration-aura-gold decoration-2 underline-offset-4"
                >
                  Terms
                </LocalizedClientLink>{" "}
                and{" "}
                <LocalizedClientLink
                  href="/privacy"
                  className="underline decoration-aura-gold decoration-2 underline-offset-4"
                >
                  Privacy Policy
                </LocalizedClientLink>
                .
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
