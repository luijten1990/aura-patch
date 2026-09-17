import { AbstractFulfillmentProviderService, MedusaError } from "@medusajs/framework/utils"
import type { CalculateShippingOptionPriceDTO, CreateFulfillmentResult, FulfillmentDTO, FulfillmentItemDTO, FulfillmentOption, FulfillmentOrderDTO, ValidateFulfillmentDataContext } from "@medusajs/framework/types"

type Address = { address_1?: string; address_2?: string; city?: string; province?: string; postal_code?: string; country_code?: string; first_name?: string; last_name?: string; company?: string; phone?: string; email?: string }
type Options = { apiToken: string; baseUrl: string; itemDescription: string; itemValueUsd: number; itemHsCode?: string; weightOz: number; lengthIn: number; widthIn: number; heightIn: number; brevoApiKey?: string; labelEmailTo?: string; labelEmailFrom?: string; labelEmailFromName?: string }
type EasyRate = {
  currency?: string
  total_charge?: number
  shipment_charge_total?: number
  cost_rank?: number
  courier_service?: { id?: string; name?: string; umbrella_name?: string }
}

const DOMESTIC_OPTION_ID = "easyship-domestic"
const INTERNATIONAL_OPTION_ID = "easyship-international"

export class EasyshipFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "easyship"
  protected readonly options_: Options
  constructor(_: Record<string, unknown>, options: Options) { super(); this.options_ = options }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      { id: INTERNATIONAL_OPTION_ID, name: "Live international rate" },
      { id: DOMESTIC_OPTION_ID, name: "Domestic UPS Ground" },
    ]
  }
  async validateOption() { return true }
  async canCalculate() { return true }

  async validateFulfillmentData(optionData: Record<string, unknown>, data: Record<string, unknown>, context: ValidateFulfillmentDataContext) {
    const destination = context.shipping_address as Address | undefined
    const origin = context.from_location?.address as Address | undefined
    this.assertDestination(optionData, destination)
    this.assertAddress(origin, "warehouse")
    return { ...data, easyship_origin: origin, easyship_option_id: this.optionId(optionData) }
  }

  async calculatePrice(optionData: CalculateShippingOptionPriceDTO["optionData"], data: CalculateShippingOptionPriceDTO["data"], context: CalculateShippingOptionPriceDTO["context"]) {
    const destination = context.shipping_address as Address | undefined
    const origin = (data.easyship_origin || context.from_location?.address) as Address | undefined
    this.assertDestination(optionData, destination)
    this.assertAddress(origin, "warehouse")
    const domestic = this.isDomestic(optionData, destination)
    const rate = await this.quoteRate(origin!, destination!, domestic)
    return { calculated_amount: Math.round(this.charge(rate) * 100), is_calculated_price_tax_inclusive: false }
  }

  async createFulfillment(
    data: Record<string, unknown>,
    _items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    _fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
  ): Promise<CreateFulfillmentResult> {
    const destination = order?.shipping_address as Address | undefined
    const origin = data.easyship_origin as Address | undefined
    const optionData = { id: data.easyship_option_id || data.id }
    this.assertDestination(optionData, destination)
    this.assertAddress(origin, "warehouse")
    const domestic = this.isDomestic(optionData, destination)
    const rate = await this.quoteRate(origin!, destination!, domestic)
    const courierServiceId = rate.courier_service?.id

    const result = await this.request("/shipments", {
      origin_address: this.address(origin!),
      destination_address: this.address(destination!),
      ...(domestic ? {} : { incoterms: "DDP" }),
      order_data: { platform_order_number: order?.id },
      courier_settings: {
        allow_fallback: true,
        apply_shipping_rules: true,
        ...(courierServiceId ? { courier_service_id: courierServiceId } : {}),
      },
      shipping_settings: {
        buy_label: true,
        buy_label_synchronous: true,
        printing_options: { format: "pdf", label: "4x6", commercial_invoice: "A4", packing_slip: "none" },
      },
      parcels: [this.parcel()],
    })
    const shipment = (result.shipment || result) as Record<string, unknown>
    const shipmentId = this.firstString(shipment, ["easyship_shipment_id", "shipment_id", "id"])
    const trackingNumber = this.firstString(shipment, ["tracking_number"])
    const pdfBase64 = this.labelPdfBase64(shipment)
    const labelUrl = this.firstString(shipment, ["label_url", "label_file_url", "label"]) || (pdfBase64 ? `data:application/pdf;base64,${pdfBase64}` : undefined)
    const trackingUrl = this.firstString(shipment, ["tracking_url", "tracking_page_url"])
    if (!shipmentId || !trackingNumber || !labelUrl) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Easyship did not return a shipment ID, tracking number, and label URL"
      )
    }
    await this.sendLabelEmail({ trackingNumber, pdfBase64, trackingUrl: trackingUrl || labelUrl })

    return {
      data: {
        easyship_shipment_id: shipmentId,
        easyship_tracking_number: trackingNumber,
        easyship_courier_service_id: courierServiceId,
        easyship_courier_name: [rate.courier_service?.umbrella_name, rate.courier_service?.name].filter(Boolean).join(" "),
        easyship_label_cost_cents: Math.round(this.charge(rate) * 100),
        easyship_label_currency: rate.currency || "USD",
      },
      labels: [{ tracking_number: trackingNumber, tracking_url: trackingUrl || labelUrl, label_url: labelUrl }],
    }
  }
  async cancelFulfillment() { return {} }

  private async quoteRate(origin: Address, destination: Address, domestic: boolean) {
    const response = await this.request("/rates", {
      origin_address: this.address(origin),
      destination_address: this.address(destination),
      parcels: [this.parcel()],
      ...(domestic ? {} : { incoterms: "DDP", calculate_tax_and_duties: true }),
    })
    const rates = (response.rates || []) as EasyRate[]
    const valid = rates.filter((rate) => rate.currency === "USD" && Number.isFinite(this.charge(rate)))
    if (!valid.length) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "No USD Easyship rate is available for this destination"
      )
    }
    return domestic ? this.pickDomesticRate(valid) : this.pickCheapest(valid)
  }

  private pickDomesticRate(rates: EasyRate[]) {
    const upsGround = rates.filter((rate) => {
      const blob = `${rate.courier_service?.umbrella_name || ""} ${rate.courier_service?.name || ""}`.toLowerCase()
      return blob.includes("ups") && blob.includes("ground") && !blob.includes("surepost") && !blob.includes("mail innovations")
    })
    return this.pickCheapest(upsGround.length ? upsGround : rates)
  }

  private pickCheapest(rates: EasyRate[]) {
    return rates.reduce((a, b) => this.charge(a) <= this.charge(b) ? a : b)
  }

  private charge(rate: EasyRate) {
    return rate.total_charge ?? rate.shipment_charge_total ?? Number.POSITIVE_INFINITY
  }

  private optionId(optionData: Record<string, unknown> | undefined) {
    return typeof optionData?.id === "string" ? optionData.id : undefined
  }

  private isDomestic(optionData: Record<string, unknown> | undefined, destination: Address | undefined) {
    const id = this.optionId(optionData)
    if (id === DOMESTIC_OPTION_ID) {
      return true
    }
    if (id === INTERNATIONAL_OPTION_ID) {
      return false
    }
    return destination?.country_code?.toLowerCase() === "us"
  }

  private assertDestination(optionData: Record<string, unknown> | undefined, destination: Address | undefined) {
    this.assertAddress(destination, "shipping")
    const domestic = this.isDomestic(optionData, destination)
    const us = destination?.country_code?.toLowerCase() === "us"
    if (domestic && !us) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Easyship domestic UPS Ground is only available for United States addresses"
      )
    }
    if (!domestic && us) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Easyship international shipping is for destinations outside the US"
      )
    }
  }

  private parcel() {
    const kg = Number((this.options_.weightOz * 0.0283495).toFixed(4))
    return { total_actual_weight: kg, box: { length: this.options_.lengthIn * 2.54, width: this.options_.widthIn * 2.54, height: this.options_.heightIn * 2.54 }, items: [{ description: this.options_.itemDescription, actual_weight: kg, declared_currency: "USD", declared_customs_value: this.options_.itemValueUsd, ...(this.options_.itemHsCode ? { hs_code: this.options_.itemHsCode } : {}) }] }
  }
  private address(value: Address) { return { line_1: value.address_1, line_2: value.address_2, city: value.city, state: value.province, postal_code: value.postal_code, country_alpha2: value.country_code?.toUpperCase(), contact_name: [value.first_name, value.last_name].filter(Boolean).join(" ") || value.company, company_name: value.company, contact_phone: value.phone, contact_email: value.email } }
  private labelPdfBase64(shipment: Record<string, unknown>) {
    const documents = shipment.shipping_documents
    if (!Array.isArray(documents)) return undefined
    for (const document of documents) {
      if (!document || typeof document !== "object") continue
      const value = document as Record<string, unknown>
      const files = value.base64_encoded_strings
      if (value.category === "label" && Array.isArray(files) && typeof files[0] === "string" && files[0]) return files[0]
    }
    return undefined
  }
  private firstString(value: unknown, names: string[]): string | undefined {
    if (!value || typeof value !== "object") return undefined
    const record = value as Record<string, unknown>
    for (const name of names) if (typeof record[name] === "string" && record[name]) return record[name] as string
    for (const child of Object.values(record)) {
      if (child && typeof child === "object") {
        const found = this.firstString(child, names)
        if (found) return found
      }
    }
    return undefined
  }
  private async request(path: string, body: Record<string, unknown>) {
    const response = await fetch(`${this.options_.baseUrl}/2024-09${path}`, { method: "POST", headers: { Authorization: `Bearer ${this.options_.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const result = await response.json() as Record<string, unknown>
    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Easyship request failed (${response.status}): ${JSON.stringify(result)}`
      )
    }
    return result
  }
  private async sendLabelEmail({ trackingNumber, pdfBase64, trackingUrl }: { trackingNumber: string; pdfBase64?: string; trackingUrl: string }) {
    if (!pdfBase64 || !this.options_.brevoApiKey || !this.options_.labelEmailFrom || !this.options_.labelEmailTo) return
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": this.options_.brevoApiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: { email: this.options_.labelEmailFrom, name: this.options_.labelEmailFromName || "Aura Patch Orders" },
          to: [{ email: this.options_.labelEmailTo }],
          subject: `Easyship label — ${trackingNumber}`,
          textContent: `An Easyship shipping label has been created. Tracking number: ${trackingNumber}\n${trackingUrl}`,
          htmlContent: `<p>An Easyship shipping label has been created.</p><p><strong>Tracking:</strong> <a href="${trackingUrl}">${trackingNumber}</a></p>`,
          attachment: [{ name: `easyship-label-${trackingNumber}.pdf`, content: pdfBase64 }],
          tags: ["easyship-label"],
        }),
      })
      if (!response.ok) console.error(`Brevo Easyship label email failed (${response.status}): ${await response.text()}`)
    } catch (error) {
      console.error("Brevo Easyship label email request failed", error)
    }
  }
  private assertAddress(value: Address | undefined, kind: string) {
    if (!value?.address_1 || !value.city || !value.postal_code || !value.country_code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The ${kind} address is missing fields needed for a shipping quote`
      )
    }
  }
}
