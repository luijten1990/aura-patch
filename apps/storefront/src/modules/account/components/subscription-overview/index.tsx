"use client"

import { cancelSubscription, type StoreSubscription } from "@lib/data/subscriptions"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formatDate = (value?: string | null) => {
  if (!value) {
    return "—"
  }
  return new Date(value).toLocaleDateString()
}

export default function SubscriptionOverview({
  subscriptions,
}: {
  subscriptions: StoreSubscription[]
}) {
  if (!subscriptions.length) {
    return (
      <p className="text-[15px] leading-7 text-aura-forest/65">
        You do not have an active subscription yet. Choose Subscribe & Save at
        checkout. We will charge your card, place a new order, and buy a
        shipping label every month until you cancel.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  )
}

const SubscriptionCard = ({
  subscription,
}: {
  subscription: StoreSubscription
}) => {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "canceling" | "error">("idle")
  const active = subscription.status === "active"

  const onCancel = async () => {
    if (!active || status === "canceling") {
      return
    }
    setStatus("canceling")
    try {
      await cancelSubscription(subscription.id)
      router.refresh()
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-aura-forest/15 bg-white/40 p-6">
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-aura-gold">
        {subscription.status || "active"}
      </p>
      <h2 className="aura-display mt-2 text-[28px] font-normal leading-none">
        Subscribe & Save 20%
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-aura-forest/70">
        Renews {subscription.interval || "monthly"}. Next order{" "}
        {formatDate(subscription.next_order_date)}. Started{" "}
        {formatDate(subscription.subscription_date)}.
      </p>
      {active && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-aura-forest/70 underline decoration-aura-gold decoration-2 underline-offset-4"
        >
          {status === "canceling"
            ? "Canceling…"
            : status === "error"
            ? "Try again"
            : "Cancel subscription"}
        </button>
      )}
    </div>
  )
}
