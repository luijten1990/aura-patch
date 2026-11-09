import { applyForAffiliate, retrieveAffiliate } from "@lib/data/affiliates"
import { redirect } from "next/navigation"

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)

export default async function ReferralsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const { affiliate, commissions } = await retrieveAffiliate()
  const pending = commissions
    .filter((row) => row.status === "pending")
    .reduce((sum, row) => sum + row.commission_amount, 0)

  async function apply(formData: FormData) {
    "use server"
    const code = String(formData.get("code") || "")
    const name = String(formData.get("name") || "")
    await applyForAffiliate(code, name)
    redirect(`/${countryCode}/account/referrals`)
  }

  return (
    <div className="w-full">
      <h1 className="aura-display text-[36px] font-normal leading-none">
        Partner link
      </h1>
      <p className="mt-4 max-w-[36rem] text-[15px] leading-7 text-aura-forest/65">
        Share your link. A paid order keeps your code, and a pending commission
        is recorded at your rate. It is not payable until it is approved.
      </p>
      {!affiliate && (
        <form action={apply} className="mt-8 flex max-w-md flex-col gap-3">
          <input
            name="name"
            placeholder="Your name"
            className="min-h-12 rounded-full border border-aura-forest/20 px-5"
            required
          />
          <input
            name="code"
            placeholder="yourname"
            className="min-h-12 rounded-full border border-aura-forest/20 px-5"
            required
          />
          <button className="aura-button" type="submit">
            Request a partner link
          </button>
        </form>
      )}
      {affiliate && (
        <div className="mt-8">
          <p className="text-[12px] uppercase tracking-[0.14em] text-aura-forest/50">
            {affiliate.status} · {affiliate.commission_rate}%
          </p>
          <p className="aura-display mt-3 break-all text-[28px]">
            getaurapatch.com/us?ref={affiliate.code}
          </p>
          <p className="mt-4 text-[15px]">Pending {money(pending, "usd")}</p>
          <ul className="mt-6 divide-y divide-aura-forest/10">
            {commissions.map((row) => (
              <li key={row.id} className="flex justify-between py-3 text-[14px]">
                <span>
                  {row.status} · {row.referral_code}
                </span>
                <span>{money(row.commission_amount, row.currency_code)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
