import { MedusaService } from "@medusajs/framework/utils"
import Affiliate from "./models/affiliate"
import Commission from "./models/commission"
import { commissionAmount } from "./commission"

class AffiliateModuleService extends MedusaService({
  Affiliate,
  Commission,
}) {
  async recordOrderCommission(input: {
    code: string
    orderId: string
    baseAmount: number
    currencyCode?: string | null
    customerId?: string | null
    source?: "initial" | "renewal"
  }) {
    const code = input.code.trim().toLowerCase()
    const [affiliate] = await this.listAffiliates({ code, status: "active" })
    if (!affiliate) {
      return null
    }

    const existing = await this.listAffiliateCommissions({
      order_id: input.orderId,
    })
    if (existing.length) {
      return existing[0]
    }

    const amount = commissionAmount(input.baseAmount, affiliate.commission_rate)
    const created = await this.createAffiliateCommissions({
      affiliate_id: affiliate.id,
      order_id: input.orderId,
      customer_id: input.customerId || null,
      referral_code: code,
      source: input.source === "renewal" ? "renewal" : "initial",
      base_amount: input.baseAmount,
      commission_amount: amount,
      currency_code: input.currencyCode || "usd",
      status: "pending",
    })
    return Array.isArray(created) ? created[0] : created
  }
}

export default AffiliateModuleService
