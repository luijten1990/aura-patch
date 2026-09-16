import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils"

export const WELCOME_OFFER_CODE = "ILOVEAURA"
export const WELCOME_OFFER_PERCENT = 15

type WelcomeOfferInput = {
  email: string
}

type SendWelcomeEmailInput = {
  email: string
  code: string
}

const ensureWelcomeOfferStep = createStep(
  "ensure-welcome-offer",
  async (_, { container }) => {
    const promotionModule = container.resolve(Modules.PROMOTION)
    const existing = await promotionModule.listPromotions({
      code: WELCOME_OFFER_CODE,
    })

    if (existing.length) {
      return new StepResponse({ code: WELCOME_OFFER_CODE, created: false })
    }

    try {
      await promotionModule.createPromotions({
        code: WELCOME_OFFER_CODE,
        type: "standard",
        status: "active",
        is_automatic: false,
        application_method: {
          type: "percentage",
          target_type: "items",
          allocation: "across",
          value: WELCOME_OFFER_PERCENT,
        },
      })
    } catch (error) {
      const later = await promotionModule.listPromotions({
        code: WELCOME_OFFER_CODE,
      })

      if (!later.length) {
        throw error
      }
    }

    return new StepResponse({ code: WELCOME_OFFER_CODE, created: true })
  }
)

const sendWelcomeOfferEmailStep = createStep(
  "send-welcome-offer-email",
  async ({ email, code }: SendWelcomeEmailInput, { container }) => {
    const apiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL
    const senderName = process.env.BREVO_SENDER_NAME || "Aura Patch"
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    if (!apiKey || !senderEmail) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Welcome offer email is disabled: set BREVO_API_KEY and BREVO_SENDER_EMAIL."
      )
    }

    const shopUrl = "https://www.getaurapatch.com/us/products/aura-patch"
    const htmlContent = `<!doctype html>
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
            <p style="margin:0 0 17px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;letter-spacing:1.6px;text-transform:uppercase;color:#77866d;">A welcome from Aura</p>
            <h1 style="margin:0 0 28px;font-family:Georgia,'Times New Roman',serif;font-size:40px;line-height:47px;font-weight:400;color:#1d2821;">15% off your first order.</h1>
            <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#405044;">Thank you for joining us. Use this code at checkout:</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;"><tr>
              <td align="center" style="background:#f7f4ed;border:1px solid #d9ddd3;padding:18px 16px;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:3px;color:#173f36;">${code}</td>
            </tr></table>
            <p style="margin:0 0 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:27px;color:#405044;">Peel, apply, and go — a simpler path to daily wellness.</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#173f36"><a href="${shopUrl}" style="display:inline-block;padding:15px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:#ffffff;text-decoration:none;">Shop Aura Patch</a></td></tr></table>
          </td></tr>
          <tr><td align="center" style="padding:29px 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#667068;">Questions? Reply to this email or write to <a href="mailto:info@getaurapatch.com" style="color:#405044;text-decoration:underline;">info@getaurapatch.com</a>.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email }],
        subject: "Your Aura Patch welcome: 15% off with ILOVEAURA",
        htmlContent,
      }),
    })

    if (!response.ok) {
      logger.error(`Brevo rejected the welcome offer email (${response.status}).`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Brevo rejected the email (${response.status}).`
      )
    }

    return new StepResponse({ emailed: true })
  }
)

export const sendWelcomeOfferWorkflow = createWorkflow(
  "send-welcome-offer",
  (input: WelcomeOfferInput) => {
    const offer = ensureWelcomeOfferStep()

    sendWelcomeOfferEmailStep({
      email: input.email,
      code: offer.code,
    })

    return new WorkflowResponse({
      code: offer.code,
    })
  }
)

export const ensureWelcomeOfferWorkflow = createWorkflow(
  "ensure-welcome-offer",
  () => {
    const offer = ensureWelcomeOfferStep()

    return new WorkflowResponse({
      code: offer.code,
    })
  }
)
