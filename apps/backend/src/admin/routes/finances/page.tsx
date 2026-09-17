import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CurrencyDollar } from "@medusajs/icons"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"

type StripeBank = {
  bank_name?: string
  last4?: string
  currency?: string
  country?: string
  status?: string
}

type StripePayout = {
  id: string
  amount: number
  currency: string
  arrival_date: number
  status: string
}

type FinancesOverview = {
  currency: string
  revenue_cents: number
  shipping_collected_cents: number
  refunds_cents: number
  label_cost_cents: number
  stripe_fees_cents: number
  profit_cents: number
  paid_order_count: number
  labeled_shipment_count: number
  stripe: {
    configured: boolean
    livemode: boolean
    payouts_enabled: boolean
    charges_enabled: boolean
    dashboard_payouts_url: string
    available_cents: number
    pending_cents: number
    bank: StripeBank | null
    recent_payouts: StripePayout[]
  }
}

const money = (cents: number, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)

const FinancesPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-finances"],
    queryFn: async () => {
      const response = await fetch("/admin/finances", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(`Unable to load finances (${response.status})`)
      }
      return response.json() as Promise<FinancesOverview>
    },
  })

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading>Finances</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Revenue from paid orders, Easyship label costs, Stripe fees, and
            payouts to your bank.
          </Text>
        </div>
        {isLoading && (
          <div className="px-6 py-6">
            <Text>Loading finances...</Text>
          </div>
        )}
        {error && (
          <div className="px-6 py-6">
            <Text className="text-ui-fg-error">{String(error)}</Text>
          </div>
        )}
        {data && (
          <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Revenue" value={money(data.revenue_cents, data.currency)} hint={`${data.paid_order_count} paid orders`} />
            <Metric label="Label costs" value={money(data.label_cost_cents, data.currency)} hint={`${data.labeled_shipment_count} purchased labels`} />
            <Metric label="Stripe fees" value={money(data.stripe_fees_cents, data.currency)} hint="Card processing fees" />
            <Metric label="Profit" value={money(data.profit_cents, data.currency)} hint="Revenue minus refunds, labels, and Stripe fees" />
          </div>
        )}
      </Container>

      {data && (
        <>
          <Container className="divide-y p-0">
            <div className="px-6 py-4">
              <Heading level="h2">Payouts</Heading>
              <Text className="text-ui-fg-subtle" size="small">
                Stripe pays captured charges into the bank account on this
                Stripe account. Add or change the bank in Stripe Dashboard.
              </Text>
            </div>
            <div className="flex flex-col gap-4 px-6 py-6">
              {!data.stripe.configured && (
                <Text>
                  Stripe is not configured on this backend. Set STRIPE_API_KEY
                  to show payouts.
                </Text>
              )}
              {data.stripe.configured && (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Metric
                      label="Available"
                      value={money(data.stripe.available_cents, data.currency)}
                      hint={data.stripe.payouts_enabled ? "Ready to pay out" : "Payouts are not enabled yet"}
                    />
                    <Metric
                      label="Pending"
                      value={money(data.stripe.pending_cents, data.currency)}
                      hint="Not yet available"
                    />
                    <Metric
                      label="Bank"
                      value={
                        data.stripe.bank?.last4
                          ? `${data.stripe.bank.bank_name || "Bank"} ••${data.stripe.bank.last4}`
                          : "Not connected"
                      }
                      hint={data.stripe.bank?.status || "Connect a bank in Stripe"}
                    />
                  </div>
                  <div>
                    <Button
                      asChild
                      variant={data.stripe.bank ? "secondary" : "primary"}
                    >
                      <a
                        href={data.stripe.dashboard_payouts_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {data.stripe.bank ? "Manage bank account" : "Connect bank account"}
                      </a>
                    </Button>
                  </div>
                  {data.stripe.recent_payouts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <Text weight="plus">Recent payouts</Text>
                      {data.stripe.recent_payouts.map((payout) => (
                        <div
                          key={payout.id}
                          className="flex items-center justify-between text-ui-fg-subtle"
                        >
                          <Text size="small">
                            {new Date(payout.arrival_date * 1000).toLocaleDateString()} · {payout.status}
                          </Text>
                          <Text size="small">{money(payout.amount, payout.currency)}</Text>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </Container>

          <Container className="divide-y p-0">
            <div className="px-6 py-4">
              <Heading level="h2">Notes</Heading>
            </div>
            <div className="px-6 py-4">
              <Text size="small" className="text-ui-fg-subtle">
                Profit here is paid order totals, minus refunds, Easyship label
                costs stored on fulfillments, and Stripe card fees. It does not
                subtract product cost, Hostinger, ads, or unpaid shipping
                options. Label costs appear after a label is purchased. Customers
                paid {money(data.shipping_collected_cents, data.currency)} in
                shipping.
              </Text>
            </div>
          </Container>
        </>
      )}
    </div>
  )
}

const Metric = ({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) => (
  <div className="flex flex-col gap-1">
    <Text size="small" className="text-ui-fg-subtle">{label}</Text>
    <Heading level="h2">{value}</Heading>
    <Text size="small" className="text-ui-fg-muted">{hint}</Text>
  </div>
)

export const config = defineRouteConfig({
  label: "Finances",
  icon: CurrencyDollar,
})

export default FinancesPage
