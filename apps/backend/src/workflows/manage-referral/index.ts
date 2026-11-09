import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { AFFILIATE_MODULE } from "../../modules/affiliate"
import AffiliateModuleService from "../../modules/affiliate/service"

export type ManageReferralInput = {
  action:
    | "create_partner"
    | "set_partner_status"
    | "set_commission_status"
    | "save_payout"
    | "request_partner"
  id?: string
  name?: string
  email?: string
  code?: string
  commission_rate?: number
  status?: string
  payout_email?: string
  customer_id?: string
}

const codeOf = (value?: string) => (value || "").trim().toLowerCase()

const manageReferralStep = createStep(
  "manage-referral",
  async (input: ManageReferralInput, { container }) => {
    const affiliates = container.resolve<AffiliateModuleService>(AFFILIATE_MODULE)

    if (input.action === "create_partner") {
      const name = input.name?.trim()
      const email = input.email?.trim().toLowerCase()
      const code = codeOf(input.code)
      if (!name || !email || !/^[a-z0-9][a-z0-9_-]{0,31}$/.test(code)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Name, email, and a short code are required."
        )
      }
      const created = await affiliates.createAffiliates({
        name,
        email,
        code,
        status: "active",
        commission_rate: Number(input.commission_rate) || 20,
      })
      return new StepResponse({ affiliate: created })
    }

    if (input.action === "set_partner_status") {
      if (!input.id || !["pending", "active", "rejected"].includes(input.status || "")) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "A partner and status are required.")
      }
      const updated = await affiliates.updateAffiliates({
        id: input.id,
        status: input.status,
      })
      return new StepResponse({ affiliate: updated })
    }

    if (input.action === "save_payout") {
      const email = input.email?.trim().toLowerCase()
      const payout = input.payout_email?.trim().toLowerCase()
      if (!email || !payout) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "A payout email is required.")
      }
      const [existing] = await affiliates.listAffiliates({ email })
      if (!existing) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "No partner profile was found for this account.")
      }
      const updated = await affiliates.updateAffiliates({
        id: existing.id,
        payout_email: payout,
      })
      return new StepResponse({ affiliate: updated })
    }

    if (input.action === "request_partner") {
      const email = input.email?.trim().toLowerCase()
      const code = codeOf(input.code)
      if (!email || !/^[a-z0-9][a-z0-9_-]{0,31}$/.test(code)) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "Choose a short partner code.")
      }
      const [existing] = await affiliates.listAffiliates({ email })
      if (existing) {
        return new StepResponse({ affiliate: existing })
      }
      const created = await affiliates.createAffiliates({
        name: input.name?.trim() || email,
        email,
        code,
        status: "pending",
        commission_rate: 20,
        customer_id: input.customer_id || null,
      })
      return new StepResponse({ affiliate: created })
    }

    if (input.action === "set_commission_status") {
      if (!input.id || !["pending", "approved", "paid", "void"].includes(input.status || "")) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "A commission and status are required.")
      }
      const updated = await affiliates.updateAffiliateCommissions({
        id: input.id,
        status: input.status,
      })
      return new StepResponse({ commission: updated })
    }

    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Unknown referral action.")
  }
)

const manageReferralWorkflow = createWorkflow(
  "manage-referral",
  (input: ManageReferralInput) => {
    const result = manageReferralStep(input)
    return new WorkflowResponse(result)
  }
)

export default manageReferralWorkflow
