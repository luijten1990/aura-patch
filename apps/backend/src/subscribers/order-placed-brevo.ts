import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type OrderItem = {
  product_title?: string
  variant_title?: string
  quantity?: number
  unit_price?: number
}

type Order = {
  id: string
  display_id?: number
  email?: string
  currency_code?: string
  total?: number
  items?: OrderItem[]
}

type BrevoEmail = {
  sender: { email: string; name?: string }
  to: { email: string }[]
  subject: string
  htmlContent: string
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }

    return entities[character]
  })

const formatAmount = (amount: number | undefined, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((amount ?? 0) / 100)

const sendBrevoEmail = async (apiKey: string, email: BrevoEmail) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
  })

  if (!response.ok) {
    throw new Error(`Brevo rejected the email (${response.status}).`)
  }
}

export default async function orderPlacedBrevoHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || "Aura Patch"
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!apiKey || !senderEmail) {
    logger.warn(
      "Brevo order emails are disabled: set BREVO_API_KEY and BREVO_SENDER_EMAIL."
    )
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "items.product_title",
      "items.variant_title",
      "items.quantity",
      "items.unit_price",
    ],
    filters: { id: data.id },
  })

  if (!order) {
    logger.error(`Brevo order email skipped: order ${data.id} was not found.`)
    return
  }

  // `query.graph` returns generated nullable field types; this subscriber only
  // requests the fields represented by the local email payload type.
  const typedOrder = order as unknown as Order
  const orderNumber = typedOrder.display_id ?? typedOrder.id
  const total = formatAmount(typedOrder.total, typedOrder.currency_code)
  const items = (typedOrder.items ?? [])
    .map(
      (item) =>
        `<li>${escapeHtml(item.product_title ?? "Item")}${
          item.variant_title ? ` — ${escapeHtml(item.variant_title)}` : ""
        } × ${item.quantity ?? 0}</li>`
    )
    .join("")

  const sender = { email: senderEmail, name: senderName }
  const customerHtml = `<h1>Thanks for your order!</h1><p>Your Aura Patch order #${orderNumber} has been received.</p><ul>${items}</ul><p><strong>Total: ${total}</strong></p>`

  if (typedOrder.email) {
    await sendBrevoEmail(apiKey, {
      sender,
      to: [{ email: typedOrder.email }],
      subject: `Aura Patch order #${orderNumber} confirmed`,
      htmlContent: customerHtml,
    })
  }

  const recipients = (process.env.BREVO_NEW_ORDER_RECIPIENTS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)

  if (recipients.length) {
    await sendBrevoEmail(apiKey, {
      sender,
      to: recipients.map((email) => ({ email })),
      subject: `New Aura Patch order #${orderNumber}`,
      htmlContent: `<h1>New order received</h1><p>Order #${orderNumber} from ${escapeHtml(typedOrder.email ?? "unknown customer")}.</p><ul>${items}</ul><p><strong>Total: ${total}</strong></p>`,
    })
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
