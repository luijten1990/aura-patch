"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export type StoreAffiliate = {
  id: string
  code: string
  name: string
  email: string
  status: "pending" | "active" | "rejected"
  commission_rate: number
}

export type StoreCommission = {
  id: string
  order_id: string
  referral_code: string
  base_amount: number
  commission_amount: number
  currency_code: string
  status: "pending" | "approved" | "void"
}

export const retrieveAffiliate = async () => {
  const headers = { ...(await getAuthHeaders()) }
  return sdk.client
    .fetch<{ affiliate: StoreAffiliate | null; commissions: StoreCommission[] }>(
      "/store/customers/me/affiliate",
      { method: "GET", headers, cache: "no-store" }
    )
    .catch(() => ({ affiliate: null, commissions: [] }))
}

export const applyForAffiliate = async (code: string, name: string) => {
  const headers = { ...(await getAuthHeaders()) }
  return sdk.client.fetch<{ affiliate: StoreAffiliate }>(
    "/store/customers/me/affiliate",
    {
      method: "POST",
      headers,
      body: { code, name },
    }
  )
}
