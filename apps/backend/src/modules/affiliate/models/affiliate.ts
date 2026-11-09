import { model } from "@medusajs/framework/utils"

const Affiliate = model.define("affiliate", {
  id: model.id().primaryKey(),
  code: model.text().unique(),
  email: model.text(),
  name: model.text(),
  status: model.enum(["pending", "active", "rejected"]).default("pending"),
  commission_rate: model.number().default(20),
  customer_id: model.text().nullable(),
  payout_email: model.text().nullable(),
})

export default Affiliate
