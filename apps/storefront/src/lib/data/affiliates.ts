"use server"

import { sdk } from "@lib/config"
import { login } from "./customer"
import { getAuthHeaders } from "./cookies"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type StoreAffiliate = {
  id: string
  code: string
  name: string
  email: string
  status: "pending" | "active" | "rejected"
  commission_rate: number
  payout_email?: string | null
}

export type StoreCommission = {
  id: string
  order_id: string
  customer_id?: string | null
  referral_code: string
  base_amount: number
  commission_amount: number
  currency_code: string
  source?: "initial" | "renewal"
  status: "pending" | "approved" | "paid" | "void"
  created_at?: string
}

export type AffiliateSummary = {
  month_revenue: number
  month_commission: number
  month_customers: number
  active_subscriptions: number
  pending: number
  approved: number
  paid: number
}

const emptySummary: AffiliateSummary = {
  month_revenue: 0,
  month_commission: 0,
  month_customers: 0,
  active_subscriptions: 0,
  pending: 0,
  approved: 0,
  paid: 0,
}

export const retrieveAffiliate = async () => {
  const headers = { ...(await getAuthHeaders()) }
  return sdk.client
    .fetch<{
      affiliate: StoreAffiliate | null
      commissions: StoreCommission[]
      summary?: AffiliateSummary
    }>(
      "/store/customers/me/affiliate",
      { method: "GET", headers, cache: "no-store" }
    )
    .then((result) => ({
      affiliate: result.affiliate,
      commissions: result.commissions || [],
      summary: result.summary || emptySummary,
    }))
    .catch(() => ({ affiliate: null, commissions: [], summary: emptySummary }))
}

export async function loginToPortal(
  currentState: unknown,
  formData: FormData
) {
  const countryCode = String(formData.get("countryCode") || "us")
  const result = await login(currentState, formData)
  if (result?.state === "success") {
    redirect(`/${countryCode}/ambassadors/dashboard`)
  }
  return result
}

export const savePayoutEmail = async (payoutEmail: string) => {
  const headers = { ...(await getAuthHeaders()) }
  await sdk.client.fetch<{ affiliate: StoreAffiliate }>(
    "/store/customers/me/affiliate",
    {
      method: "POST",
      headers,
      body: { payout_email: payoutEmail },
    }
  )
  revalidatePath("/[countryCode]/ambassadors/dashboard", "page")
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
