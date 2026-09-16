import { Heading, Text } from "@modules/common/components/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <main className="min-h-[70vh] bg-aura-cream py-12 text-aura-forest small:py-20">
      <div
        className="content-container max-w-[920px]"
        data-testid="order-complete-container"
      >
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <span className="aura-eyebrow text-aura-gold">Order confirmed</span>
        <Heading
          level="h1"
          className="aura-display mt-4 text-[44px] font-normal leading-none small:text-[64px]"
        >
          Thank you
        </Heading>
        <Text className="mt-5 max-w-[36rem] text-[16px] leading-7 text-aura-forest/65">
          Your order was placed successfully.
        </Text>
        <div className="mt-8">
          <OrderDetails order={order} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 small:grid-cols-[minmax(0,1fr)_300px] small:items-start small:gap-12">
          <div>
            <Heading
              level="h2"
              className="aura-display text-[38px] font-normal leading-none"
            >
              Summary
            </Heading>
            <Items order={order} />
          </div>
          <div className="rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] p-6 small:p-8">
            <CartTotals totals={order} variant="aura" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 small:grid-cols-2">
          <div className="rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] p-6 small:p-8">
            <ShippingDetails order={order} />
          </div>
          <div className="rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] p-6 small:p-8">
            <PaymentDetails order={order} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8 border-t border-aura-forest/15 pt-8 small:flex-row small:items-end small:justify-between">
          <Help />
          <LocalizedClientLink href="/store" className="aura-button inline-flex">
            Continue shopping
          </LocalizedClientLink>
        </div>
      </div>
    </main>
  )
}
