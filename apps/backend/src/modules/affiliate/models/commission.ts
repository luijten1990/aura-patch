import { model } from "@medusajs/framework/utils"

const Commission = model.define("affiliate_commission", {
  id: model.id().primaryKey(),
  affiliate_id: model.text().index(),
  order_id: model.text().unique(),
  customer_id: model.text().nullable(),
  referral_code: model.text(),
  source: model.enum(["initial", "renewal"]).default("initial"),
  base_amount: model.number(),
  commission_amount: model.number(),
  currency_code: model.text().default("usd"),
  status: model.enum(["pending", "approved", "paid", "void"]).default("pending"),
})

export default Commission
