"use client"

import { Button } from "@modules/common/components/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex w-full flex-col gap-y-8">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-aura-forest/15 pb-6 last:border-none last:pb-0"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex w-full flex-col items-center gap-y-4 text-center"
      data-testid="no-orders-container"
    >
      <h2 className="aura-display text-[32px] font-normal leading-none">
        Nothing to see here
      </h2>
      <p className="max-w-[28rem] text-[15px] leading-7 text-aura-forest/65">
        You don&apos;t have any orders yet, let us change that.
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button
            data-testid="continue-shopping-button"
            className="min-h-12 rounded-full !bg-aura-wine px-6 text-[11px] font-bold uppercase tracking-[0.16em] !text-aura-cream hover:!bg-aura-forest hover:!text-aura-cream"
          >
            Continue shopping
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
