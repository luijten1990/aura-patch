import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowPath } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"

type SubscriptionRow = {
  id: string
  status?: string
  interval?: string
  period?: number
  subscription_date?: string
  next_order_date?: string | null
  customer?: {
    email?: string
    first_name?: string
    last_name?: string
  }
  orders?: { id?: string }[]
}

const formatDate = (value?: string | null) => {
  if (!value) {
    return "—"
  }
  return new Date(value).toLocaleDateString()
}

const SubscriptionsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const response = await fetch("/admin/subscriptions", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(`Unable to load subscriptions (${response.status})`)
      }
      return response.json() as Promise<{
        subscriptions: SubscriptionRow[]
        count: number
      }>
    },
  })

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading>Subscriptions</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Auto-renewing Subscribe & Save orders. Customers get 20% off and
            can cancel from their account.
          </Text>
        </div>
        {isLoading && (
          <div className="px-6 py-6">
            <Text>Loading subscriptions...</Text>
          </div>
        )}
        {error && (
          <div className="px-6 py-6">
            <Text className="text-ui-fg-error">{String(error)}</Text>
          </div>
        )}
        {data && (
          <div className="px-6 py-6">
            <Text size="small" className="text-ui-fg-subtle">
              {data.count} subscription{data.count === 1 ? "" : "s"}
            </Text>
            <div className="mt-4 flex flex-col gap-3">
              {data.subscriptions.length === 0 && (
                <Text size="small">No subscriptions yet.</Text>
              )}
              {data.subscriptions.map((subscription) => {
                const name = [
                  subscription.customer?.first_name,
                  subscription.customer?.last_name,
                ].filter(Boolean).join(" ")
                return (
                  <div
                    key={subscription.id}
                    className="flex flex-col gap-1 border-b border-ui-border-base pb-3 last:border-b-0"
                  >
                    <Text weight="plus">
                      {name || subscription.customer?.email || subscription.id}
                    </Text>
                    <Text size="small" className="text-ui-fg-subtle">
                      {subscription.status} · {subscription.interval} · next{" "}
                      {formatDate(subscription.next_order_date)} ·{" "}
                      {subscription.orders?.length || 0} orders
                    </Text>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Subscriptions",
  icon: ArrowPath,
})

export default SubscriptionsPage
