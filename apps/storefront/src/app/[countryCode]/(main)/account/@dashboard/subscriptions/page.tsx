import { Metadata } from "next"

import SubscriptionOverview from "@modules/account/components/subscription-overview"
import { listSubscriptions } from "@lib/data/subscriptions"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage your Aura Patch Subscribe & Save orders.",
}

export default async function Subscriptions() {
  const subscriptions = await listSubscriptions().catch(() => null)

  if (!subscriptions) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="subscriptions-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="aura-display text-[36px] font-normal leading-none small:text-[44px]">
          Subscriptions
        </h1>
        <p className="max-w-[36rem] text-[15px] leading-7 text-aura-forest/65">
          Auto-renewing Aura Patch deliveries at 20% off. Cancel any time and
          you will not be charged for the next month.
        </p>
      </div>
      <SubscriptionOverview subscriptions={subscriptions} />
    </div>
  )
}
