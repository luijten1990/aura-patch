"use client"

import { loginToPortal, savePayoutEmail } from "@lib/data/affiliates"
import type {
  AffiliateSummary,
  StoreAffiliate,
  StoreCommission,
} from "@lib/data/affiliates"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useActionState, useState } from "react"

const money = (amount: number, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount || 0)

const sections = ["Overview", "Referrals", "Earnings", "Marketing", "Profile"] as const

export function PortalLogin({ countryCode }: { countryCode: string }) {
  const [message, formAction] = useActionState(loginToPortal, null)

  return (
    <form action={formAction} className="mx-auto flex w-full max-w-[440px] flex-col gap-3">
      <input type="hidden" name="countryCode" value={countryCode} />
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        className="min-h-12 rounded-full border border-aura-forest/20 bg-transparent px-5"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password"
        className="min-h-12 rounded-full border border-aura-forest/20 bg-transparent px-5"
      />
      <ErrorMessage error={message?.state === "error" ? message.error : null} />
      {message?.state === "verification_required" && (
        <p className="text-[14px] leading-6 text-aura-forest/70">
          Verify {message.email}, then sign in again.
        </p>
      )}
      <SubmitButton className="aura-button mt-2">Sign in</SubmitButton>
    </form>
  )
}

export function PartnerPortal({
  affiliate,
  commissions,
  summary,
  countryCode,
}: {
  affiliate: StoreAffiliate
  commissions: StoreCommission[]
  summary: AffiliateSummary
  countryCode: string
}) {
  const [section, setSection] = useState<(typeof sections)[number]>("Overview")
  const [copied, setCopied] = useState(false)
  const link = `getaurapatch.com/${countryCode}?ref=${affiliate.code}`
  const currency = commissions[0]?.currency_code || "usd"

  const copy = async () => {
    await navigator.clipboard.writeText(`https://${link}`)
    setCopied(true)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sections.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSection(item)}
            className={`rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.12em] ${
              section === item ? "bg-aura-forest text-aura-cream" : "border border-aura-forest/20"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {section === "Overview" && (
        <div className="mt-10">
          <p className="text-[12px] uppercase tracking-[0.14em] text-aura-forest/50">
            Your performance · this month
          </p>
          <div className="mt-6 grid gap-8 small:grid-cols-4">
            <Stat label="Revenue generated" value={money(summary.month_revenue, currency)} />
            <Stat label="Commission earned" value={money(summary.month_commission, currency)} />
            <Stat label="Referred customers" value={String(summary.month_customers)} />
            <Stat label="Active subscriptions" value={String(summary.active_subscriptions)} />
          </div>
          <p className="mt-6 max-w-[40rem] text-[14px] leading-6 text-aura-forest/60">
            These figures come from paid orders attributed to your code. Link visits are not counted, so there is no conversion rate yet.
          </p>
        </div>
      )}

      {section === "Referrals" && (
        <ul className="mt-10 divide-y divide-aura-forest/10">
          {commissions.filter((row) => row.status !== "void").map((row) => (
            <li key={row.id} className="flex justify-between gap-4 py-4 text-[14px]">
              <span>
                {row.source === "renewal" ? "Renewal" : "First order"} · {row.status}
                <span className="mt-1 block text-aura-forest/50">{row.order_id}</span>
              </span>
              <span>{money(row.base_amount, row.currency_code)}</span>
            </li>
          ))}
          {!commissions.length && <li className="py-4 text-[14px]">No referred orders yet.</li>}
        </ul>
      )}

      {section === "Earnings" && (
        <div className="mt-10 max-w-[28rem]">
          <table className="w-full text-left text-[15px]">
            <tbody>
              <Row label="Pending" amount={money(summary.pending, currency)} />
              <Row label="Approved" amount={money(summary.approved, currency)} />
              <Row label="Already paid" amount={money(summary.paid, currency)} />
            </tbody>
          </table>
          <p className="mt-6 text-[14px] leading-6 text-aura-forest/65">
            You earn {affiliate.commission_rate}% on the first eligible order and on each Subscribe & Save renewal while that subscription stays active and attributed to you. A cancellation stops future renewals. A refund or canceled order voids that order’s commission.
          </p>
          <ul className="mt-6 divide-y divide-aura-forest/10">
            {commissions.map((row) => (
              <li key={row.id} className="flex justify-between py-3 text-[14px]">
                <span>{row.source === "renewal" ? "Renewal" : "Initial"} · {row.status}</span>
                <span>{money(row.commission_amount, row.currency_code)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section === "Marketing" && (
        <div className="mt-10">
          <p className="text-[12px] uppercase tracking-[0.14em] text-aura-forest/50">Your referral link</p>
          <p className="aura-display mt-3 break-all text-[28px]">{link}</p>
          <button type="button" onClick={copy} className="aura-button mt-6">
            {copied ? "Copied" : "Copy link"}
          </button>
          <p className="mt-8 max-w-[36rem] text-[15px] leading-7 text-aura-forest/70">
            Share that link as written. Describe Aura as a daily ritual with 19 ingredients, peel and apply, worn for up to 12 hours. Do not say it treats, cures, or prevents disease. Discount codes and downloadable banners are sent by Aura when a campaign needs them.
          </p>
        </div>
      )}

      {section === "Profile" && (
        <form
          className="mt-10 flex max-w-md flex-col gap-3"
          action={async (formData) => {
            await savePayoutEmail(String(formData.get("payout_email") || ""))
          }}
        >
          <p className="text-[15px]">{affiliate.name}</p>
          <p className="text-[14px] text-aura-forest/60">{affiliate.email}</p>
          <input
            name="payout_email"
            type="email"
            defaultValue={affiliate.payout_email || ""}
            placeholder="Payout email"
            className="min-h-12 rounded-full border border-aura-forest/20 px-5"
            required
          />
          <button className="aura-button" type="submit">Save payout email</button>
          <p className="text-[13px] leading-6 text-aura-forest/55">
            Aura pays this address manually. The portal does not store a bank account.
          </p>
        </form>
      )}
    </div>
  )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[12px] uppercase tracking-[0.12em] text-aura-forest/50">{label}</p>
    <p className="aura-display mt-2 text-[40px] leading-none">{value}</p>
  </div>
)

const Row = ({ label, amount }: { label: string; amount: string }) => (
  <tr className="border-b border-aura-forest/10">
    <th className="py-3 font-normal">{label}</th>
    <td className="py-3 text-right">{amount}</td>
  </tr>
)
