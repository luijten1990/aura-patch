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
  const customerHtml = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f5f3ed;color:#1d2821;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f5f3ed;">
      <tr><td align="center" style="padding:28px 16px 42px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
          <tr><td align="center" bgcolor="#173f36" style="background:#173f36;padding:19px 24px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
              <td valign="middle" style="padding-right:14px;"><img src="https://www.getaurapatch.com/images/aura-flower-of-life-white-transparent.png" width="62" height="62" alt="Aura Patch" style="display:block;border:0;outline:none;text-decoration:none;width:62px;height:62px;"></td>
              <td valign="middle" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:31px;letter-spacing:4px;font-weight:400;color:#ffffff;">AURA&nbsp;PATCH</td>
            </tr></table>
          </td></tr>
          <tr><td style="background:#ffffff;border:1px solid #e1e0d8;padding:44px 44px 46px;">
            <p style="margin:0 0 17px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;letter-spacing:1.6px;text-transform:uppercase;color:#77866d;">Order confirmed</p>
            <h1 style="margin:0 0 28px;font-family:Georgia,'Times New Roman',serif;font-size:40px;line-height:47px;font-weight:400;color:#1d2821;">Thank you<br>for your purchase.</h1>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 25px;"><tr>
              <td width="154" valign="top" style="width:154px;padding:2px 24px 8px 0;"><a href="https://www.getaurapatch.com/us/products/aura-patch" style="text-decoration:none;"><img src="https://www.getaurapatch.com/_next/image?url=%2Fimages%2Faura-patch-front-original.jpeg&w=1600&q=75" width="130" alt="Aura Patch daily wellness and immune support patch" style="display:block;width:130px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;"></a></td>
              <td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#405044;"><p style="margin:0 0 14px;">Hi there,</p><p style="margin:0;">Thank you for choosing Aura Patch. Your order <strong style="color:#1d2821;">#${escapeHtml(String(orderNumber))}</strong> has been received, and we’re preparing it with care.</p></td>
            </tr></table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0;border-top:1px solid #d9ddd3;border-bottom:1px solid #d9ddd3;"><tr><td style="padding:20px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:25px;color:#405044;"><strong style="font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#77866d;">Your order</strong><ul style="margin:13px 0 12px;padding-left:20px;">${items}</ul><p style="margin:0;"><strong style="color:#1d2821;">Total: ${total}</strong></p></td></tr></table>
            <p style="margin:0 0 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:27px;color:#405044;">We’re glad to be part of your daily wellness routine.</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#173f36"><a href="https://www.getaurapatch.com/us/products/aura-patch" style="display:inline-block;padding:15px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:#ffffff;text-decoration:none;">Explore Aura Patch</a></td></tr></table>
          </td></tr>
          <tr><td align="center" style="padding:29px 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#667068;">Questions? Reply to this email or write to <a href="mailto:info@getaurapatch.com" style="color:#405044;text-decoration:underline;">info@getaurapatch.com</a>.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

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
