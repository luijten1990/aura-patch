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
import manageReferralWorkflow from "../../../../../workflows/manage-referral"
import { SUBSCRIPTION_MODULE } from "../../../../../modules/subscription"
import SubscriptionModuleService from "../../../../../modules/subscription/service"

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
    { order: { created_at: "DESC" }, take: 100 }
  )
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)
  const open = commissions.filter((row) => row.status !== "void")
  const thisMonth = open.filter((row) => new Date(row.created_at) >= monthStart)
  const sum = (rows: typeof commissions, statuses?: string[]) =>
    rows
      .filter((row) => !statuses || statuses.includes(row.status))
      .reduce((total, row) => total + Number(row.commission_amount || 0), 0)
  let attributedSubscriptions: { id: string }[] = []
  try {
    const subscriptions = req.scope.resolve<SubscriptionModuleService>(SUBSCRIPTION_MODULE)
    const activeSubscriptions = await subscriptions.listSubscriptions(
      { status: "active" },
      { take: 500 }
    )
    attributedSubscriptions = activeSubscriptions.filter((subscription) => {
      const metadata = subscription.metadata as { renewal?: { referral_code?: string } } | null
      return metadata?.renewal?.referral_code === affiliate.code
    })
  } catch {
    attributedSubscriptions = []
  }

  res.json({
    affiliate,
    commissions,
    summary: {
      month_revenue: thisMonth.reduce((total, row) => total + Number(row.base_amount || 0), 0),
      month_commission: sum(thisMonth),
      month_customers: new Set(thisMonth.map((row) => row.customer_id || row.order_id)).size,
      active_subscriptions: attributedSubscriptions.length,
      pending: sum(commissions, ["pending"]),
      approved: sum(commissions, ["approved"]),
      paid: sum(commissions, ["paid"]),
    },
  })
}

type Body = { name?: string; code?: string; payout_email?: string }

export const POST = async (
  req: AuthenticatedMedusaRequest<Body>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
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
  if (!email) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "This account has no email.")
  }

  if (req.body?.payout_email) {
    const { result } = await manageReferralWorkflow(req.scope).run({
      input: {
        action: "save_payout",
        email,
        payout_email: req.body.payout_email,
      },
    })
    res.json(result)
    return
  }

  const name =
    req.body?.name?.trim() ||
    [record?.first_name, record?.last_name].filter(Boolean).join(" ") ||
    email
  const { result } = await manageReferralWorkflow(req.scope).run({
    input: {
      action: "request_partner",
      email,
      name,
      code: req.body?.code,
      customer_id: record?.id,
    },
  })
  res.status(201).json(result)
}
