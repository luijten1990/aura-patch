import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import type { CalculateShippingOptionPriceDTO, CreateFulfillmentResult, FulfillmentDTO, FulfillmentItemDTO, FulfillmentOption, FulfillmentOrderDTO, ValidateFulfillmentDataContext } from "@medusajs/types"

type Address = { address_1?: string; address_2?: string; city?: string; province?: string; postal_code?: string; country_code?: string; first_name?: string; last_name?: string; company?: string; phone?: string; email?: string }
type Options = { apiToken: string; baseUrl: string; itemDescription: string; itemValueUsd: number; itemHsCode?: string; weightOz: number; lengthIn: number; widthIn: number; heightIn: number }

export class EasyshipFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "easyship"
  protected readonly options_: Options
  constructor(_: Record<string, unknown>, options: Options) { super(); this.options_ = options }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> { return [{ id: "easyship-international", name: "Live international rate" }] }
  async validateOption() { return true }
  async canCalculate() { return true }

  async validateFulfillmentData(_: Record<string, unknown>, data: Record<string, unknown>, context: ValidateFulfillmentDataContext) {
    const destination = context.shipping_address as Address | undefined
    const origin = context.from_location?.address as Address | undefined
    this.assertInternational(destination); this.assertAddress(origin, "warehouse")
    return { ...data, easyship_origin: origin }
  }

  async calculatePrice(_: CalculateShippingOptionPriceDTO["optionData"], data: CalculateShippingOptionPriceDTO["data"], context: CalculateShippingOptionPriceDTO["context"]) {
    const destination = context.shipping_address as Address | undefined
    const origin = (data.easyship_origin || context.from_location?.address) as Address | undefined
    this.assertInternational(destination); this.assertAddress(origin, "warehouse")
    // Quote delivered-duty-paid shipping so checkout collects any quoteable
    // import taxes and duties instead of leaving a surprise charge for the buyer.
    const response = await this.request("/rates", { origin_address: this.address(origin!), destination_address: this.address(destination!), incoterms: "DDP", calculate_tax_and_duties: true, parcels: [this.parcel()] })
    const rates = (response.rates || []) as { total_charge?: number; shipment_charge_total?: number; currency?: string }[]
    const valid = rates.filter((rate) => rate.currency === "USD" && (rate.total_charge ?? rate.shipment_charge_total) !== undefined)
    if (!valid.length) throw new Error("No USD Easyship rate is available for this destination")
    const cheapest = valid.reduce((a, b) => (a.total_charge ?? a.shipment_charge_total)! <= (b.total_charge ?? b.shipment_charge_total)! ? a : b)
    return { calculated_amount: Math.round((cheapest.total_charge ?? cheapest.shipment_charge_total!) * 100), is_calculated_price_tax_inclusive: false }
  }

  async createFulfillment(
    data: Record<string, unknown>,
    _items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    _fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
  ): Promise<CreateFulfillmentResult> {
    const destination = order?.shipping_address as Address | undefined
    const origin = data.easyship_origin as Address | undefined
    this.assertInternational(destination)
    this.assertAddress(origin, "warehouse")

    const result = await this.request("/shipments", {
      origin_address: this.address(origin!),
      destination_address: this.address(destination!),
      incoterms: "DDP",
      order_data: { platform: "medusa", platform_order_number: order?.id },
      courier_settings: { allow_fallback: true, apply_shipping_rules: true },
      shipping_settings: {
        buy_label: true,
        buy_label_synchronous: true,
        printing_options: { format: "URL", label: "4x6", commercial_invoice: "A4", packing_slip: "none" },
      },
      parcels: [this.parcel()],
    })
    const shipment = (result.shipment || result) as Record<string, unknown>
    const shipmentId = this.firstString(shipment, ["easyship_shipment_id", "shipment_id", "id"])
    const trackingNumber = this.firstString(shipment, ["tracking_number"])
    const labelUrl = this.firstString(shipment, ["label_url", "label_file_url", "label"])
    const trackingUrl = this.firstString(shipment, ["tracking_url", "tracking_page_url"])
    if (!shipmentId || !trackingNumber || !labelUrl) {
      throw new Error("Easyship did not return a shipment ID, tracking number, and label URL")
    }

    return {
      data: { easyship_shipment_id: shipmentId, easyship_tracking_number: trackingNumber },
      labels: [{ tracking_number: trackingNumber, tracking_url: trackingUrl || labelUrl, label_url: labelUrl }],
    }
  }
  async cancelFulfillment() { return {} }

  private parcel() {
    const kg = Number((this.options_.weightOz * 0.0283495).toFixed(4))
    return { total_actual_weight: kg, box: { length: this.options_.lengthIn * 2.54, width: this.options_.widthIn * 2.54, height: this.options_.heightIn * 2.54 }, items: [{ description: this.options_.itemDescription, actual_weight: kg, declared_currency: "USD", declared_customs_value: this.options_.itemValueUsd, ...(this.options_.itemHsCode ? { hs_code: this.options_.itemHsCode } : {}) }] }
  }
  private address(value: Address) { return { name: [value.first_name, value.last_name].filter(Boolean).join(" ") || value.company, company_name: value.company, address_line_1: value.address_1, address_line_2: value.address_2, city: value.city, state: value.province, postal_code: value.postal_code, country_alpha2: value.country_code?.toUpperCase(), phone_number: value.phone, email: value.email } }
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
    if (!response.ok) throw new Error(`Easyship rate request failed (${response.status}): ${JSON.stringify(result)}`)
    return result
  }
  private assertInternational(value: Address | undefined) { this.assertAddress(value, "shipping"); if (value?.country_code?.toLowerCase() === "us") throw new Error("Easyship international shipping is for destinations outside the US") }
  private assertAddress(value: Address | undefined, kind: string) { if (!value?.address_1 || !value.city || !value.postal_code || !value.country_code) throw new Error(`The ${kind} address is missing fields needed for an international quote`) }
}
