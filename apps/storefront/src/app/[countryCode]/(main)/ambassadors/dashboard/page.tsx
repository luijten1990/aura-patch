import { applyForAffiliate, retrieveAffiliate } from "@lib/data/affiliates"
import { retrieveCustomer } from "@lib/data/customer"
import { PartnerPortal, PortalLogin } from "@modules/ambassadors/portal"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Ambassador portal",
  description: "Sign in to see the orders and commissions attributed to your Aura partner link.",
  robots: { index: false, follow: false },
}

export default async function AmbassadorDashboardPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await retrieveCustomer().catch(() => null)
  const { affiliate, commissions, summary } = customer
    ? await retrieveAffiliate()
    : { affiliate: null, commissions: [], summary: null }

  async function apply(formData: FormData) {
    "use server"
    await applyForAffiliate(String(formData.get("code") || ""), String(formData.get("name") || ""))
    redirect(`/${countryCode}/ambassadors/dashboard`)
  }

  return (
    <main className="bg-aura-cream text-aura-forest">
      <section className="aura-shell py-14 small:py-20">
        <p className="aura-eyebrow text-aura-gold">Aura partner portal</p>
        <h1 className="aura-display mt-4 text-[48px] leading-none small:text-[72px]">
          {customer ? "Welcome back" : "Sign in"}
        </h1>
        <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-aura-forest/65">
          This uses your Aura account password. You only see orders attributed to your own partner code.
        </p>
        {!customer && (
          <div className="mt-10">
            <PortalLogin countryCode={countryCode} />
          </div>
        )}
        {customer && !affiliate && (
          <form action={apply} className="mt-10 flex max-w-md flex-col gap-3">
            <p className="text-[15px] leading-7">
              This account is not a partner yet. Request a code and Aura will approve it before commissions are recorded.
            </p>
            <input name="name" required placeholder="Your name" className="min-h-12 rounded-full border border-aura-forest/20 px-5" />
            <input name="code" required placeholder="yourname" className="min-h-12 rounded-full border border-aura-forest/20 px-5" />
            <button className="aura-button" type="submit">Request a partner link</button>
          </form>
        )}
        {customer && affiliate && affiliate.status !== "active" && (
          <p className="mt-10 text-[16px]">
            {affiliate.code} is {affiliate.status}. Commissions start after Aura approves the code.
          </p>
        )}
        {customer && affiliate?.status === "active" && summary && (
          <div className="mt-10">
            <p className="text-[12px] uppercase tracking-[0.14em] text-aura-forest/50">
              Approved partner · {affiliate.commission_rate}%
            </p>
            <PartnerPortal
              affiliate={affiliate}
              commissions={commissions}
              summary={summary}
              countryCode={countryCode}
            />
          </div>
        )}
      </section>
    </main>
  )
}
