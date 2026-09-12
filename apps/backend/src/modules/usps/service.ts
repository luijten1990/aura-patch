import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import type {
  CreateFulfillmentResult,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  ValidateFulfillmentDataContext,
} from "@medusajs/types"

type UspsOptions = {
  clientId: string
  clientSecret: string
  crid: string
  mid: string
  paymentAccountNumber: string
  paymentAccountType: "EPS" | "PERMIT"
  permitZipCode?: string
  baseUrl: string
  mailClass: string
  rateIndicator: string
  weightOz: number
  lengthIn: number
  widthIn: number
  heightIn: number
  brevoApiKey?: string
  labelEmailTo?: string
  labelEmailFrom?: string
  labelEmailFromName?: string
}

type Address = {
  first_name?: string
  last_name?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  province?: string
  postal_code?: string
  country_code?: string
}

type UspsLabelMetadata = {
  trackingNumber?: string
  postage?: number
  links?: { rel?: string[]; href?: string }[]
  [key: string]: unknown
}

/**
 * Creates a USPS label when an admin creates an order fulfillment in Medusa.
 * USPS returns multipart data: JSON metadata plus a PDF. The PDF is kept as a
 * data URL on the fulfillment, avoiding a public bucket or a browser-side API key.
 */
export class UspsFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "usps"

  protected readonly options_: UspsOptions

  constructor(_: Record<string, unknown>, options: UspsOptions) {
    super()
    this.options_ = options
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [{ id: "usps-domestic", name: "USPS domestic" }]
  }

  async validateFulfillmentData(
    _: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ) {
    const destination = context.shipping_address as Address | undefined
    const origin = context.from_location?.address as Address | undefined
    this.assertDomesticAddress(destination, "shipping")
    this.assertDomesticAddress(origin, "stock-location")
    return { ...data, usps_origin: origin }
  }

  async validateOption(data: Record<string, unknown>) {
    return data.service === undefined || data.service === "usps-domestic"
  }

  async canCalculate() {
    return false
  }

  async createFulfillment(
    data: Record<string, unknown>,
    _items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    _fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
  ): Promise<CreateFulfillmentResult> {
    const destination = order?.shipping_address as Address | undefined
    const origin = data.usps_origin as Address | undefined
    this.assertDomesticAddress(destination, "shipping")
    this.assertDomesticAddress(origin, "stock-location")

    const accessToken = await this.getAccessToken()
    const paymentAuthorizationToken = await this.getPaymentAuthorizationToken(accessToken)
    const response = await fetch(`${this.options_.baseUrl}/labels/v3/label`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Payment-Authorization-Token": paymentAuthorizationToken,
      },
      body: JSON.stringify({
        imageInfo: {
          imageType: "PDF",
          labelType: "4X6LABEL",
          receiptOption: "NONE",
          suppressPostage: false,
          suppressMailDate: false,
          returnLabel: false,
        },
        toAddress: this.toUspsAddress(destination!),
        fromAddress: this.toUspsAddress(origin!),
        packageDescription: {
          mailClass: this.options_.mailClass,
          rateIndicator: this.options_.rateIndicator,
          weightUOM: "oz",
          weight: this.options_.weightOz,
          dimensionsUOM: "in",
          length: this.options_.lengthIn,
          width: this.options_.widthIn,
          height: this.options_.heightIn,
          processingCategory: "MACHINABLE",
          mailingDate: new Date().toISOString().slice(0, 10),
          destinationEntryFacilityType: "NONE",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`USPS label request failed (${response.status}): ${await response.text()}`)
    }

    const { metadata, pdfBase64 } = await this.parseLabelResponse(response)
    const trackingNumber = metadata.trackingNumber
    if (!trackingNumber || !pdfBase64) {
      throw new Error("USPS did not return both a tracking number and PDF label")
    }

    const trackingUrl =
      metadata.links?.find((link) => link.rel?.includes("Tracking URL"))?.href ||
      `https://tools.usps.com/go/TrackConfirmAction_input?origTrackNum=${encodeURIComponent(trackingNumber)}`
    const labelUrl = `data:application/pdf;base64,${pdfBase64}`

    // A label purchase must remain recorded even if the notification provider
    // is temporarily unavailable. Otherwise retrying fulfillment could buy a
    // duplicate USPS label.
    await this.sendLabelEmail({ trackingNumber, pdfBase64, trackingUrl })

    return {
      data: {
        usps_tracking_number: trackingNumber,
        usps_postage: metadata.postage,
        usps_label_pdf: labelUrl,
      },
      labels: [{ tracking_number: trackingNumber, tracking_url: trackingUrl, label_url: labelUrl }],
    }
  }

  async cancelFulfillment() {
    // USPS labels need the USPS refund/void process; do not silently imply a refund.
    return {}
  }

  private async getAccessToken() {
    const response = await fetch(`${this.options_.baseUrl}/oauth2/v3/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.options_.clientId,
        client_secret: this.options_.clientSecret,
        grant_type: "client_credentials",
      }),
    })
    const body = (await response.json()) as { access_token?: string; error_description?: string }
    if (!response.ok || !body.access_token) {
      throw new Error(`USPS OAuth failed: ${body.error_description || response.statusText}`)
    }
    return body.access_token
  }

  private async getPaymentAuthorizationToken(accessToken: string) {
    const role = {
      CRID: this.options_.crid,
      MID: this.options_.mid,
      manifestMID: this.options_.mid,
      accountType: this.options_.paymentAccountType,
      accountNumber: this.options_.paymentAccountNumber,
      ...(this.options_.paymentAccountType === "PERMIT" && this.options_.permitZipCode
        ? { permitZIPCode: this.options_.permitZipCode }
        : {}),
    }
    const response = await fetch(`${this.options_.baseUrl}/payments/v3/payment-authorization`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ roles: [{ roleName: "PAYER", ...role }, { roleName: "LABEL_OWNER", ...role }] }),
    })
    const body = (await response.json()) as { paymentAuthorizationToken?: string; error?: string }
    if (!response.ok || !body.paymentAuthorizationToken) {
      throw new Error(`USPS payment authorization failed: ${body.error || response.statusText}`)
    }
    return body.paymentAuthorizationToken
  }

  private async parseLabelResponse(response: Response) {
    const contentType = response.headers.get("content-type") || ""
    const boundary = contentType.match(/boundary=([^;]+)/i)?.[1]?.replace(/^"|"$/g, "")
    if (!boundary) throw new Error("USPS label response did not include a multipart boundary")

    const raw = Buffer.from(await response.arrayBuffer())
    const marker = Buffer.from(`--${boundary}`)
    const metadataMatch = raw.toString("utf8").match(/name="labelMetadata"[\s\S]*?\r?\n\r?\n([\s\S]*?)\r?\n--/)
    const pdfHeader = Buffer.from('name="labelImage"')
    const pdfPartStart = raw.indexOf(pdfHeader)
    if (!metadataMatch || pdfPartStart === -1) throw new Error("USPS label response was missing label metadata or PDF")

    const pdfDataStart = raw.indexOf(Buffer.from("\r\n\r\n"), pdfPartStart) + 4
    const pdfEnd = raw.indexOf(marker, pdfDataStart) - 2
    if (pdfDataStart < 4 || pdfEnd <= pdfDataStart) throw new Error("USPS label PDF could not be read")

    return {
      metadata: JSON.parse(metadataMatch[1]) as UspsLabelMetadata,
      pdfBase64: raw.subarray(pdfDataStart, pdfEnd).toString("base64"),
    }
  }

  private async sendLabelEmail({
    trackingNumber,
    pdfBase64,
    trackingUrl,
  }: {
    trackingNumber: string
    pdfBase64: string
    trackingUrl: string
  }) {
    if (!this.options_.brevoApiKey || !this.options_.labelEmailFrom || !this.options_.labelEmailTo) {
      return
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": this.options_.brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            email: this.options_.labelEmailFrom,
            name: this.options_.labelEmailFromName || "Aura Patch Orders",
          },
          to: [{ email: this.options_.labelEmailTo }],
          subject: `USPS label — ${trackingNumber}`,
          textContent: `A USPS shipping label has been created. Tracking number: ${trackingNumber}\n${trackingUrl}`,
          htmlContent: `<p>A USPS shipping label has been created.</p><p><strong>Tracking:</strong> <a href="${trackingUrl}">${trackingNumber}</a></p>`,
          attachment: [
            {
              name: `usps-label-${trackingNumber}.pdf`,
              content: pdfBase64,
            },
          ],
          tags: ["usps-label"],
        }),
      })

      if (!response.ok) {
        // Intentionally do not throw: the label has already been purchased.
        console.error(`Brevo label email failed (${response.status}): ${await response.text()}`)
      }
    } catch (error) {
      // Intentionally do not throw: see the duplicate-label safeguard above.
      console.error("Brevo label email request failed", error)
    }
  }

  private toUspsAddress(address: Address) {
    const [firstName = "", ...lastNameParts] = (address.first_name || address.company || "").trim().split(/\s+/)
    return {
      firstName,
      lastName: lastNameParts.join(" ") || address.last_name || "",
      firm: address.company,
      streetAddress: address.address_1,
      secondaryAddress: address.address_2,
      city: address.city,
      state: address.province,
      ZIPCode: address.postal_code,
    }
  }

  private assertDomesticAddress(address: Address | undefined, kind: string) {
    if (address?.country_code?.toLowerCase() !== "us") {
      throw new Error(`USPS domestic labels require a US ${kind} address`)
    }
    if (!address.address_1 || !address.city || !address.province || !address.postal_code) {
      throw new Error(`The ${kind} address is missing required USPS fields`)
    }
  }
}
