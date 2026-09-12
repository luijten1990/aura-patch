import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import type { CalculateShippingOptionPriceDTO, CreateFulfillmentResult, FulfillmentOption, ValidateFulfillmentDataContext } from "@medusajs/types"

type Address = { address_1?: string; address_2?: string; city?: string; province?: string; postal_code?: string; country_code?: string; first_name?: string; last_name?: string; company?: string; phone?: string; email?: string }
type Options = { apiToken: string; itemDescription: string; itemValueUsd: number; itemHsCode?: string; weightOz: number; lengthIn: number; widthIn: number; heightIn: number }

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

  async createFulfillment(): Promise<CreateFulfillmentResult> {
    throw new Error("Easyship label purchase requires the configured international shipment workflow")
  }
  async cancelFulfillment() { return {} }

  private parcel() {
    const kg = Number((this.options_.weightOz * 0.0283495).toFixed(4))
    return { total_actual_weight: kg, box: { length: this.options_.lengthIn * 2.54, width: this.options_.widthIn * 2.54, height: this.options_.heightIn * 2.54 }, items: [{ description: this.options_.itemDescription, actual_weight: kg, declared_currency: "USD", declared_customs_value: this.options_.itemValueUsd, ...(this.options_.itemHsCode ? { hs_code: this.options_.itemHsCode } : {}) }] }
  }
  private address(value: Address) { return { name: [value.first_name, value.last_name].filter(Boolean).join(" ") || value.company, company_name: value.company, address_line_1: value.address_1, address_line_2: value.address_2, city: value.city, state: value.province, postal_code: value.postal_code, country_alpha2: value.country_code?.toUpperCase(), phone_number: value.phone, email: value.email } }
  private async request(path: string, body: Record<string, unknown>) {
    const response = await fetch(`https://public-api.easyship.com/2024-09${path}`, { method: "POST", headers: { Authorization: `Bearer ${this.options_.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const result = await response.json() as Record<string, unknown>
    if (!response.ok) throw new Error(`Easyship rate request failed (${response.status}): ${JSON.stringify(result)}`)
    return result
  }
  private assertInternational(value: Address | undefined) { this.assertAddress(value, "shipping"); if (value?.country_code?.toLowerCase() === "us") throw new Error("Easyship international shipping is for destinations outside the US") }
  private assertAddress(value: Address | undefined, kind: string) { if (!value?.address_1 || !value.city || !value.postal_code || !value.country_code) throw new Error(`The ${kind} address is missing fields needed for an international quote`) }
}
