import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const limit = Math.min(Number(req.query.limit) || 50, 100)
  const offset = Number(req.query.offset) || 0

  const { data: subscriptions, metadata } = await query.graph({
    entity: "subscription",
    fields: [
      "id",
      "status",
      "interval",
      "period",
      "subscription_date",
      "last_order_date",
      "next_order_date",
      "customer.email",
      "customer.first_name",
      "customer.last_name",
      "orders.id",
      "orders.display_id",
    ],
    pagination: {
      skip: offset,
      take: limit,
    },
  })

  res.json({
    subscriptions,
    count: metadata?.count || subscriptions.length,
    limit,
    offset,
  })
}
