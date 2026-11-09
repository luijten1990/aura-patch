import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Users } from "@medusajs/icons"
import { Button, Container, Heading, Input, Label, Text } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

type Partner = {
  id: string
  name: string
  email: string
  code: string
  status: "pending" | "active" | "rejected"
  commission_rate: number
}

type Commission = {
  id: string
  affiliate_id: string
  order_id: string
  referral_code: string
  base_amount: number
  commission_amount: number
  currency_code: string
  status: "pending" | "approved" | "paid" | "void"
  created_at?: string
}

type ReferralOrder = {
  id: string
  display_id?: number
  email?: string
  currency_code?: string
  total?: number
  created_at?: string
  referral_code: string
}

type ReferralsResponse = {
  orders: ReferralOrder[]
  count: number
  partners: Partner[]
  commissions: Commission[]
}

const money = (amount?: number, currency?: string) => {
  if (amount == null || Number.isNaN(amount)) {
    return "—"
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format(amount)
}

const sumBy = (rows: Commission[], statuses: Commission["status"][]) =>
  rows
    .filter((row) => statuses.includes(row.status))
    .reduce((sum, row) => sum + Number(row.commission_amount || 0), 0)

const ReferralsPage = () => {
  const client = useQueryClient()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [formError, setFormError] = useState("")

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-referrals"],
    queryFn: async () => {
      const response = await fetch("/admin/referrals", { credentials: "include" })
      if (!response.ok) {
        throw new Error(`Unable to load referrals (${response.status})`)
      }
      return response.json() as Promise<ReferralsResponse>
    },
  })

  const save = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const response = await fetch("/admin/referrals", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || `Request failed (${response.status})`)
      }
      return response.json()
    },
    onSuccess: async () => {
      setFormError("")
      setName("")
      setEmail("")
      setCode("")
      await client.invalidateQueries({ queryKey: ["admin-referrals"] })
    },
    onError: (saveError) => {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save.")
    },
  })

  const partners = data?.partners || []
  const commissions = data?.commissions || []
  const orders = data?.orders || []
  const currency = commissions[0]?.currency_code || orders[0]?.currency_code || "usd"
  const owed = sumBy(commissions, ["pending", "approved"])
  const paid = sumBy(commissions, ["paid"])

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading>Referrals</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Partner links, orders they sent, and the commission still to pay. Mark a row paid after you send the money. The site does not send payouts itself.
          </Text>
        </div>
        {isLoading && <Text className="px-6 py-4" size="small">Loading referrals…</Text>}
        {error && (
          <Text className="px-6 py-4 text-ui-fg-error" size="small">
            {error instanceof Error ? error.message : "Unable to load referrals."}
          </Text>
        )}
        {data && (
          <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-4">
            <Metric label="To pay" value={money(owed, currency)} hint="Pending and approved" />
            <Metric label="Paid" value={money(paid, currency)} hint="Marked paid in this ledger" />
            <Metric label="Partners" value={String(partners.length)} hint={`${partners.filter((partner) => partner.status === "active").length} active`} />
            <Metric label="Referred orders" value={String(orders.length)} hint="Latest 200 orders with a code" />
          </div>
        )}
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Add a partner</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Their link is the store URL with ?ref= and this code. New partners start active at 20%.
          </Text>
        </div>
        <form
          className="grid gap-3 px-6 py-4 md:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault()
            save.mutate({
              action: "create_partner",
              name,
              email,
              code,
              commission_rate: 20,
            })
          }}
        >
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <Label>Code</Label>
            <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="maya" />
          </div>
          <div className="flex items-end">
            <Button type="submit" isLoading={save.isPending}>Add partner</Button>
          </div>
          {formError && <Text className="text-ui-fg-error md:col-span-4" size="small">{formError}</Text>}
        </form>
        <div className="divide-y">
          {partners.map((partner) => (
            <div key={partner.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <Text weight="plus">{partner.name}</Text>
                <Text size="small" className="text-ui-fg-subtle">
                  {partner.email} · ?ref={partner.code} · {partner.commission_rate}% · {partner.status}
                </Text>
              </div>
              <div className="flex gap-2">
                {partner.status !== "active" && (
                  <Button size="small" variant="secondary" onClick={() => save.mutate({ action: "set_partner_status", id: partner.id, status: "active" })}>
                    Activate
                  </Button>
                )}
                {partner.status !== "rejected" && (
                  <Button size="small" variant="secondary" onClick={() => save.mutate({ action: "set_partner_status", id: partner.id, status: "rejected" })}>
                    Pause
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!partners.length && <Text className="px-6 py-4" size="small">No partners yet.</Text>}
        </div>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Commissions</Heading>
        </div>
        {commissions.map((row) => (
          <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div>
              <Text weight="plus">{money(row.commission_amount, row.currency_code)} · {row.referral_code}</Text>
              <Text size="small" className="text-ui-fg-subtle">
                Order {row.order_id} · sale {money(row.base_amount, row.currency_code)} · {row.status}
              </Text>
            </div>
            <div className="flex gap-2">
              {row.status !== "paid" && row.status !== "void" && (
                <Button size="small" onClick={() => save.mutate({ action: "set_commission_status", id: row.id, status: "paid" })}>
                  Mark paid
                </Button>
              )}
              {row.status !== "void" && (
                <Button size="small" variant="secondary" onClick={() => save.mutate({ action: "set_commission_status", id: row.id, status: "void" })}>
                  Void
                </Button>
              )}
            </div>
          </div>
        ))}
        {!commissions.length && <Text className="px-6 py-4" size="small">No commissions yet.</Text>}
      </Container>
    </div>
  )
}

const Metric = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <div>
    <Text size="small" className="text-ui-fg-subtle">{label}</Text>
    <Heading level="h2">{value}</Heading>
    <Text size="small" className="text-ui-fg-subtle">{hint}</Text>
  </div>
)

export const config = defineRouteConfig({
  label: "Referrals",
  icon: Users,
})

export default ReferralsPage
