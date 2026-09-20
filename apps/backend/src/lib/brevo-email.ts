type BrevoEmail = {
  sender: { email: string; name?: string }
  to: { email: string }[]
  subject: string
  htmlContent: string
  tags?: string[]
  attachment?: { name: string; content: string }[]
}

export const sendBrevoEmail = async (apiKey: string, email: BrevoEmail) => {
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

export const formatOrderAmount = (amount: number | undefined, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount ?? 0)

export const defaultOrderNotificationRecipients = () => {
  const configured = (process.env.BREVO_NEW_ORDER_RECIPIENTS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
  if (configured.length) {
    return configured
  }
  return ["orders@getaurapatch.com"]
}
