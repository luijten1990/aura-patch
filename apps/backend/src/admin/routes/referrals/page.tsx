import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Users } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"

type ReferralOrder = {
  id: string
  display_id?: number
  email?: string
  currency_code?: string
  total?: number
  created_at?: string
  referral_code: string
}

const money = (amount?: number, currency?: string) => {
  if (amount == null) {
    return "—"
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format(amount)
}

const ReferralsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-referrals"],
    queryFn: async () => {
      const response = await fetch("/admin/referrals", { credentials: "include" })
      if (!response.ok) {
        throw new Error(`Unable to load referrals (${response.status})`)
      }
      return response.json() as Promise<{ orders: ReferralOrder[]; count: number }>
    },
  })

  const orders = data?.orders || []

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading>Referrals</Heading>
        <Text className="text-ui-fg-subtle" size="small">
          Orders that arrived from a partner link. The code is stored on the order.
          Totals include shipping and tax, so commission is calculated from these rows, not paid from this screen.
        </Text>
      </div>
      {isLoading && (
        <Text className="px-6 py-4" size="small">
          Loading referral orders…
        </Text>
      )}
      {error && (
        <Text className="px-6 py-4 text-ui-fg-error" size="small">
          {error instanceof Error ? error.message : "Unable to load referrals."}
        </Text>
      )}
      {!isLoading && !orders.length && (
        <Text className="px-6 py-4" size="small">
          No referred orders in the latest 200 orders.
        </Text>
      )}
      {!!orders.length && (
        <div className="divide-y">
          {orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[120px_100px_1fr_140px] gap-2 px-6 py-4"
            >
              <Text weight="plus">{order.referral_code}</Text>
              <Text size="small">#{order.display_id}</Text>
              <Text size="small">{order.email || "No email"}</Text>
              <Text size="small">{money(order.total, order.currency_code)}</Text>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Referrals",
  icon: Users,
})

export default ReferralsPage
