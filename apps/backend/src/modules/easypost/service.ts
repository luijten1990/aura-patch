import { AbstractFulfillmentProviderService, MedusaError } from "@medusajs/framework/utils"
import type {
  CalculateShippingOptionPriceDTO,
  CreateFulfillmentResult,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  ValidateFulfillmentDataContext,
} from "@medusajs/framework/types"

type Address = {
  address_1?: string
  address_2?: string
  city?: string
  province?: string
  postal_code?: string
  country_code?: string
  first_name?: string
  last_name?: string
  company?: string
  phone?: string
  email?: string
}

type Options = {
  apiKey: string
  baseUrl: string
  itemDescription: string
  itemValueUsd: number
  itemHsCode?: string
  customsSigner: string
  originName?: string
  originPhone?: string
  originEmail?: string
  originStreet?: string
  originCity?: string
  originState?: string
  originZip?: string
  originCountry?: string
  weightOz: number
  lengthIn: number
  widthIn: number
  heightIn: number
  brevoApiKey?: string
  labelEmailTo?: string
  labelEmailFrom?: string
  labelEmailFromName?: string
}

type EasyPostRate = {
  id?: string
  shipment_id?: string
  rate?: string
  currency?: string
  carrier?: string
  service?: string
}

type LocationContext = {
  from_location?: {
    address?: Address | Record<string, unknown> | null
  } | null
}

type EasyPostShipment = {
  id?: string
  rates?: EasyPostRate[]
  selected_rate?: EasyPostRate
  tracking_code?: string
  tracker?: { public_url?: string }
  postage_label?: { label_url?: string; label_pdf_url?: string }
  error?: { message?: string; errors?: { message?: string }[] }
}

const OPTION_ID = "easypost"
const US_TERRITORIES = new Set(["as", "gu", "mp", "pr", "vi"])

export class EasyPostFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "easypost"

  protected readonly options_: Options
  private readonly rateCache = new Map<string, { rate: EasyPostRate; at: number }>()
  private readonly inflightQuotes = new Map<string, Promise<EasyPostRate>>()
  private readonly failedQuotes = new Map<string, { at: number; message: string }>()

  constructor(_: Record<string, unknown>, options: Options) {
    super()
    this.options_ = options
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [{ id: OPTION_ID, name: "EasyPost live rate" }]
  }

  async validateOption() {
    return true
  }

  async canCalculate() {
    return true
  }

  async validateFulfillmentData(
    _optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ) {
    const destination = context.shipping_address as Address | undefined
    const origin = this.originAddress(data, context as LocationContext)
    this.assertAddress(origin, "warehouse")
    this.assertAddress(destination, "shipping")
    return { ...data, easypost_origin: origin, easypost_option_id: OPTION_ID }
  }

  async calculatePrice(
    _optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ) {
    const destination = context.shipping_address as Address | undefined
    const origin = this.originAddress(
      data as Record<string, unknown> | undefined,
      context as LocationContext
    )
    if (!this.hasAddress(origin) || !this.hasAddress(destination)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Warehouse or shipping address is missing fields needed for a shipping quote"
      )
    }
    const rate = await this.quoteRate(origin as Address, destination as Address)
    return {
      calculated_amount: this.customerCharge(rate),
      is_calculated_price_tax_inclusive: false,
    }
  }

  async createFulfillment(
    data: Record<string, unknown>,
    _items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    _fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
  ): Promise<CreateFulfillmentResult> {
    const destination = order?.shipping_address as Address | undefined
    const origin = this.originAddress(data, {
      from_location: { address: data?.easypost_origin as Address | undefined },
    })
    this.assertAddress(origin, "warehouse")
    this.assertAddress(destination, "shipping")

    const quoted = await this.quoteRate(origin as Address, destination as Address)
    const purchased = await this.buyRate(origin as Address, destination as Address, quoted)
    const rate = purchased.selected_rate || quoted
    const trackingNumber = purchased.tracking_code
    const labelUrl = purchased.postage_label?.label_pdf_url || purchased.postage_label?.label_url
    const trackingUrl =
      purchased.tracker?.public_url ||
      (trackingNumber
        ? `https://track.easypost.com/${encodeURIComponent(trackingNumber)}`
        : undefined)
    if (!trackingNumber || !labelUrl) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "EasyPost did not return a tracking number and label"
      )
    }

    const pdfBase64 = await this.labelPdfBase64(labelUrl)
    await this.sendLabelEmail({
      trackingNumber,
      pdfBase64,
      trackingUrl: trackingUrl || labelUrl,
    })

    return {
      data: {
        easypost_shipment_id: purchased.id,
        easypost_rate_id: rate.id,
        easypost_tracking_number: trackingNumber,
        easypost_carrier: rate.carrier,
        easypost_service: rate.service,
        easypost_label_cost_cents: Math.round(this.charge(rate) * 100),
        easypost_label_currency: rate.currency || "USD",
      },
      labels: [
        {
          tracking_number: trackingNumber,
          tracking_url: trackingUrl || labelUrl,
          label_url: pdfBase64 ? `data:application/pdf;base64,${pdfBase64}` : labelUrl,
        },
      ],
    }
  }

  async cancelFulfillment() {
    return {}
  }

  private async quoteRate(origin: Address, destination: Address) {
    const key = [
      origin.country_code,
      origin.postal_code,
      destination.country_code,
      destination.postal_code,
    ]
      .join("|")
      .toLowerCase()
    const cached = this.rateCache.get(key)
    if (cached && Date.now() - cached.at < 15 * 60 * 1000) {
      return cached.rate
    }
    const failed = this.failedQuotes.get(key)
    if (failed && Date.now() - failed.at < 5 * 60 * 1000) {
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, failed.message)
    }
    const inflight = this.inflightQuotes.get(key)
    if (inflight) {
      return inflight
    }
    const request = this.fetchQuote(key, origin, destination, cached)
    this.inflightQuotes.set(key, request)
    try {
      return await request
    } finally {
      this.inflightQuotes.delete(key)
    }
  }

  private async fetchQuote(
    key: string,
    origin: Address,
    destination: Address,
    cached: { rate: EasyPostRate; at: number } | undefined
  ) {
    try {
      const shipment = await this.createShipment(origin, destination, 8000)
      const rate = this.pickRate(shipment.rates || [], destination)
      this.rateCache.set(key, { rate, at: Date.now() })
      this.failedQuotes.delete(key)
      return rate
    } catch (error) {
      if (cached) {
        return cached.rate
      }
      const message =
        error instanceof Error ? error.message : "Shipping rates temporarily unavailable"
      this.failedQuotes.set(key, { at: Date.now(), message })
      throw error
    }
  }

  private async createShipment(origin: Address, destination: Address, timeoutMs: number) {
    const international = this.isInternational(destination)
    const shipment = await this.request<EasyPostShipment>(
      "POST",
      "/shipments",
      {
        shipment: {
          to_address: this.address(destination),
          from_address: this.address(origin, true),
          parcel: {
            length: this.options_.lengthIn,
            width: this.options_.widthIn,
            height: this.options_.heightIn,
            weight: this.options_.weightOz,
          },
          options: {
            label_format: "PDF",
            currency: "USD",
          },
          ...(international ? { customs_info: this.customsInfo() } : {}),
        },
      },
      timeoutMs
    )
    return shipment
  }

  private pickRate(rates: EasyPostRate[], destination: Address) {
    const usd = rates.filter(
      (rate) => (rate.currency || "USD") === "USD" && Number.isFinite(this.charge(rate)) && this.charge(rate) > 0
    )
    if (!usd.length) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "No USD EasyPost rate is available for this destination"
      )
    }
    if (!this.isInternational(destination)) {
      const preferred = usd.filter((rate) => {
        const blob = `${rate.carrier || ""} ${rate.service || ""}`.toLowerCase()
        return (
          blob.includes("groundadvantage") ||
          blob.includes("priority") ||
          (blob.includes("ups") && blob.includes("ground") && !blob.includes("surepost"))
        )
      })
      return this.cheapest(preferred.length ? preferred : usd)
    }
    return this.cheapest(usd)
  }

  private async buyRate(origin: Address, destination: Address, quoted: EasyPostRate) {
    const buy = async (shipmentId: string, rateId: string) =>
      this.request<EasyPostShipment>(
        "POST",
        `/shipments/${shipmentId}/buy`,
        { rate: { id: rateId } },
        30000
      )

    if (quoted.shipment_id && quoted.id) {
      try {
        return await buy(quoted.shipment_id, quoted.id)
      } catch {
        // Quoted shipments can expire; create a fresh one and buy that instead.
      }
    }

    const shipment = await this.createShipment(origin, destination, 30000)
    const rate = this.matchRate(shipment.rates || [], quoted) || this.pickRate(shipment.rates || [], destination)
    if (!shipment.id || !rate?.id) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "EasyPost did not return a purchasable shipping rate"
      )
    }
    return buy(shipment.id, rate.id)
  }

  private matchRate(rates: EasyPostRate[], quoted: EasyPostRate) {
    return (
      rates.find((rate) => rate.id && rate.id === quoted.id) ||
      rates.find(
        (rate) =>
          rate.carrier === quoted.carrier &&
          rate.service === quoted.service &&
          this.charge(rate) === this.charge(quoted)
      )
    )
  }

  private cheapest(rates: EasyPostRate[]) {
    return rates.reduce((a, b) => (this.charge(a) <= this.charge(b) ? a : b))
  }

  private charge(rate: EasyPostRate) {
    const amount = Number(rate.rate)
    return Number.isFinite(amount) ? amount : Number.POSITIVE_INFINITY
  }

  private customerCharge(rate: EasyPostRate) {
    return Math.round(this.charge(rate) * 100) / 100
  }

  private isInternational(destination: Address | undefined) {
    const country = destination?.country_code?.toLowerCase()
    return country !== "us" || US_TERRITORIES.has(country)
  }

  private customsInfo() {
    return {
      customs_certify: true,
      customs_signer: this.options_.customsSigner,
      contents_type: "merchandise",
      contents_explanation: this.options_.itemDescription,
      restriction_type: "none",
      eel_pfc: "NOEEI 30.37(a)",
      customs_items: [
        {
          description: this.options_.itemDescription,
          quantity: 1,
          weight: this.options_.weightOz,
          value: this.options_.itemValueUsd,
          hs_tariff_number: this.options_.itemHsCode || undefined,
          origin_country: "US",
          currency: "USD",
        },
      ],
    }
  }

  private address(value: Address, origin = false) {
    return {
      name:
        [value.first_name, value.last_name].filter(Boolean).join(" ") ||
        value.company ||
        (origin ? this.options_.originName : undefined) ||
        "Aura Patch",
      company: value.company,
      street1: value.address_1,
      street2: value.address_2,
      city: value.city,
      state: value.province,
      zip: value.postal_code,
      country: value.country_code?.toUpperCase(),
      phone: value.phone || (origin ? this.options_.originPhone : undefined),
      email: value.email || (origin ? this.options_.originEmail : undefined),
    }
  }

  private originAddress(
    data: Record<string, unknown> | undefined,
    context?: LocationContext
  ) {
    const stored = data?.easypost_origin
    const location = (
      stored && typeof stored === "object"
        ? stored
        : context?.from_location?.address
    ) as Address | undefined
    return {
      first_name: location?.first_name || this.options_.originName,
      last_name: location?.last_name,
      company: location?.company || this.options_.originName,
      address_1: location?.address_1 || this.options_.originStreet,
      address_2: location?.address_2,
      city: location?.city || this.options_.originCity,
      province: location?.province || this.options_.originState,
      postal_code: location?.postal_code || this.options_.originZip,
      country_code: location?.country_code || this.options_.originCountry || "us",
      phone: location?.phone || this.options_.originPhone,
      email: location?.email || this.options_.originEmail,
    }
  }

  private hasAddress(value: Address | undefined) {
    return Boolean(value?.address_1 && value.city && value.postal_code && value.country_code)
  }

  private assertAddress(value: Address | undefined, kind: string) {
    if (!this.hasAddress(value)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The ${kind} address is missing fields needed for a shipping quote`
      )
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    timeoutMs = 8000
  ) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    let response: Response
    try {
      response = await fetch(`${this.options_.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.options_.apiKey}:`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        error instanceof Error && error.name === "AbortError"
          ? "EasyPost rate request timed out"
          : `EasyPost request failed: ${error instanceof Error ? error.message : "unknown error"}`
      )
    } finally {
      clearTimeout(timer)
    }

    const result = (await response.json()) as T & {
      error?: { message?: string; errors?: { message?: string }[] }
    }
    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        this.errorMessage(response.status, result)
      )
    }
    return result
  }

  private errorMessage(status: number, result: Record<string, unknown>) {
    const error = result.error as { message?: string; errors?: { message?: string }[] } | undefined
    const details = [error?.message, ...(error?.errors || []).map((item) => item.message)]
      .filter(Boolean)
      .join("; ")
    return details
      ? `EasyPost request failed (${status}): ${details}`
      : `EasyPost request failed (${status}): ${JSON.stringify(result)}`
  }

  private async labelPdfBase64(labelUrl: string) {
    try {
      const response = await fetch(labelUrl)
      if (!response.ok) {
        return undefined
      }
      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.subarray(0, 4).toString() !== "%PDF") {
        return undefined
      }
      return buffer.toString("base64")
    } catch {
      return undefined
    }
  }

  private async sendLabelEmail({
    trackingNumber,
    pdfBase64,
    trackingUrl,
  }: {
    trackingNumber: string
    pdfBase64?: string
    trackingUrl: string
  }) {
    if (!pdfBase64 || !this.options_.brevoApiKey || !this.options_.labelEmailFrom || !this.options_.labelEmailTo) {
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
          subject: `EasyPost label — ${trackingNumber}`,
          textContent: `An EasyPost shipping label has been created. Tracking number: ${trackingNumber}\n${trackingUrl}`,
          htmlContent: `<p>An EasyPost shipping label has been created.</p><p><strong>Tracking:</strong> <a href="${trackingUrl}">${trackingNumber}</a></p>`,
          attachment: [{ name: `easypost-label-${trackingNumber}.pdf`, content: pdfBase64 }],
          tags: ["easypost-label"],
        }),
      })
      if (!response.ok) {
        console.error(`Brevo EasyPost label email failed (${response.status}): ${await response.text()}`)
      }
    } catch (error) {
      console.error("Brevo EasyPost label email request failed", error)
    }
  }
}
