import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AFFILIATE_MODULE } from "../../../modules/affiliate"
import AffiliateModuleService from "../../../modules/affiliate/service"
import manageReferralWorkflow from "../../../workflows/manage-referral"

type ActionBody = {
  action?: "create_partner" | "set_partner_status" | "set_commission_status"
  id?: string
  name?: string
  email?: string
  code?: string
  commission_rate?: number
  status?: string
}

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
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
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

  const affiliates = req.scope.resolve<AffiliateModuleService>(AFFILIATE_MODULE)
  const partners = await affiliates.listAffiliates({}, { order: { created_at: "DESC" } })
  const commissions = await affiliates.listAffiliateCommissions(
    {},
    { order: { created_at: "DESC" }, take: 200 }
  )

  res.json({ orders, count: orders.length, partners, commissions })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<ActionBody>,
  res: MedusaResponse
) => {
  const { result } = await manageReferralWorkflow(req.scope).run({
    input: {
      action: req.body?.action || "create_partner",
      id: req.body?.id,
      name: req.body?.name,
      email: req.body?.email,
      code: req.body?.code,
      commission_rate: req.body?.commission_rate,
      status: req.body?.status,
    },
  })

  res.status(req.body?.action === "create_partner" ? 201 : 200).json(result)
}
