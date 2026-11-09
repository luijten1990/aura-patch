import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { AFFILIATE_MODULE } from "../../../../../modules/affiliate"
import AffiliateModuleService from "../../../../../modules/affiliate/service"

const codeOf = (value?: string) => (value || "").trim().toLowerCase()

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const affiliates = req.scope.resolve<AffiliateModuleService>(AFFILIATE_MODULE)
  const {
    data: [customer],
  } = await query.graph({
    entity: "customer",
    fields: ["id", "email"],
    filters: { id: req.auth_context.actor_id },
  })
  const email = (customer as { email?: string } | undefined)?.email
  if (!email) {
    res.json({ affiliate: null, commissions: [] })
    return
  }

  const [affiliate] = await affiliates.listAffiliates({ email })
  if (!affiliate) {
    res.json({ affiliate: null, commissions: [] })
    return
  }

  const commissions = await affiliates.listAffiliateCommissions(
    { affiliate_id: affiliate.id },
    { order: { created_at: "DESC" }, take: 50 }
  )
  res.json({ affiliate, commissions })
}

type Body = { name?: string; code?: string }

export const POST = async (
  req: AuthenticatedMedusaRequest<Body>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const affiliates = req.scope.resolve<AffiliateModuleService>(AFFILIATE_MODULE)
  const {
    data: [customer],
  } = await query.graph({
    entity: "customer",
    fields: ["id", "email", "first_name", "last_name"],
    filters: { id: req.auth_context.actor_id },
  })
  const record = customer as
    | { id: string; email?: string; first_name?: string; last_name?: string }
    | undefined
  const email = record?.email?.toLowerCase()
  const code = codeOf(req.body?.code)
  if (!email || !/^[a-z0-9][a-z0-9_-]{0,31}$/.test(code)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Choose a short partner code."
    )
  }

  const [existing] = await affiliates.listAffiliates({ email })
  if (existing) {
    res.json({ affiliate: existing })
    return
  }

  const name =
    req.body?.name?.trim() ||
    [record?.first_name, record?.last_name].filter(Boolean).join(" ") ||
    email
  const created = await affiliates.createAffiliates({
    name,
    email,
    code,
    status: "pending",
    commission_rate: 20,
    customer_id: record?.id,
  })
  res.status(201).json({ affiliate: created })
}
