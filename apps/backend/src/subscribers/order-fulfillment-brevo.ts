import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendBrevoEmail } from "../lib/brevo-email"

type Fulfillment = {
  id?: string
  tracking_numbers?: string[] | null
  labels?: { tracking_number?: string; tracking_url?: string }[] | null
  data?: Record<string, unknown> | null
}

type Order = {
  id: string
  display_id?: number
  email?: string
  fulfillments?: Fulfillment[]
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character] || character)
  )

export default async function orderFulfillmentBrevoHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id?: string; order_id?: string; fulfillment_id?: string }>) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || "Aura Patch"
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!apiKey || !senderEmail) {
    return
  }

  const orderId = data.order_id || data.id
  if (!orderId) {
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
      "fulfillments.id",
      "fulfillments.tracking_numbers",
      "fulfillments.labels",
      "fulfillments.data",
    ],
    filters: { id: orderId },
  })

  if (!order) {
    logger.error(`Tracking email skipped: order ${orderId} was not found.`)
    return
  }

  const typedOrder = order as unknown as Order
  const fulfillments = typedOrder.fulfillments || []
  const fulfillment = data.fulfillment_id
    ? fulfillments.find((item) => item.id === data.fulfillment_id) || fulfillments.at(-1)
    : fulfillments.at(-1)
  const tracking = trackingFromFulfillment(fulfillment)
  if (!tracking || !typedOrder.email) {
    return
  }

  const orderNumber = typedOrder.display_id ?? typedOrder.id
  await sendBrevoEmail(apiKey, {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: typedOrder.email }],
    subject: `Your Aura Patch order #${orderNumber} is on the way`,
    tags: ["shipping-tracking"],
    htmlContent: `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px;background:#f5f3ed;color:#1d2821;font-family:Arial,Helvetica,sans-serif;">
  <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;">Thank you for your purchase.</h1>
  <p>Your Aura Patch order <strong>#${escapeHtml(String(orderNumber))}</strong> has shipped.</p>
  <p>Tracking code: <a href="${escapeHtml(tracking.url)}">${escapeHtml(tracking.code)}</a></p>
</body></html>`,
  })
}

function trackingFromFulfillment(fulfillment?: Fulfillment) {
  if (!fulfillment) {
    return null
  }
  const data = fulfillment.data || {}
  const code =
    fulfillment.labels?.[0]?.tracking_number ||
    fulfillment.tracking_numbers?.[0] ||
    (typeof data.easypost_tracking_number === "string"
      ? data.easypost_tracking_number
      : undefined) ||
    (typeof data.tracking_number === "string" ? data.tracking_number : undefined)
  if (!code) {
    return null
  }
  const url =
    fulfillment.labels?.[0]?.tracking_url ||
    (typeof data.tracking_url === "string" ? data.tracking_url : undefined) ||
    `https://track.easypost.com/${encodeURIComponent(code)}`
  return { code, url }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
