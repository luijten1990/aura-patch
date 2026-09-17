"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"

export type StoreSubscription = {
  id: string
  status?: string
  interval?: string
  period?: number
  subscription_date?: string
  last_order_date?: string
  next_order_date?: string | null
}

export const listSubscriptions = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("subscriptions")),
  }

  return sdk.client
    .fetch<{ subscriptions: StoreSubscription[] }>(
      `/store/customers/me/subscriptions`,
      {
        method: "GET",
        headers,
        next,
        cache: "no-store",
      }
    )
    .then(({ subscriptions }) => subscriptions)
    .catch((err) => medusaError(err))
}

export const cancelSubscription = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ subscription: StoreSubscription | StoreSubscription[] }>(
      `/store/customers/me/subscriptions/${id}`,
      {
        method: "POST",
        headers,
      }
    )
    .then(async (result) => {
      const cacheTag = await getCacheTag("subscriptions")
      revalidateTag(cacheTag)
      return result.subscription
    })
    .catch((err) => medusaError(err))
}
