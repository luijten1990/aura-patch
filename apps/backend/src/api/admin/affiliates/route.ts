import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { AFFILIATE_MODULE } from "../../../modules/affiliate"
import AffiliateModuleService from "../../../modules/affiliate/service"

type Body = {
  name?: string
  email?: string
  code?: string
  commission_rate?: number
  status?: "pending" | "active" | "rejected"
}

const codeOf = (value?: string) => (value || "").trim().toLowerCase()

export const POST = async (
  req: AuthenticatedMedusaRequest<Body>,
  res: MedusaResponse
) => {
  const name = req.body?.name?.trim()
  const email = req.body?.email?.trim().toLowerCase()
  const code = codeOf(req.body?.code)
  if (!name || !email || !/^[a-z0-9][a-z0-9_-]{0,31}$/.test(code)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Name, email, and a short code are required."
    )
  }

  const affiliates = req.scope.resolve<AffiliateModuleService>(AFFILIATE_MODULE)
  const created = await affiliates.createAffiliates({
    name,
    email,
    code,
    status: req.body?.status || "active",
    commission_rate: Number(req.body?.commission_rate) || 20,
  })

  res.status(201).json({ affiliate: created })
}
