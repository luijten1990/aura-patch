import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type OrderRow = {
  id: string
  display_id?: number
  email?: string
  currency_code?: string
  total?: number
  created_at?: string
  metadata?: Record<string, unknown> | null
}

export const GET = async (
  _req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = _req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "created_at",
      "metadata",
    ],
    pagination: {
      take: 200,
      order: { created_at: "DESC" },
    },
  })

  const orders = (data as OrderRow[])
    .map((order) => {
      const code = order.metadata?.referral_code
      return typeof code === "string" && code
        ? {
            id: order.id,
            display_id: order.display_id,
            email: order.email,
            currency_code: order.currency_code,
            total: order.total,
            created_at: order.created_at,
            referral_code: code,
          }
        : null
    })
    .filter((order) => order !== null)

  res.json({ orders, count: orders.length })
}
