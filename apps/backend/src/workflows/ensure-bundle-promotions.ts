import { Modules } from "@medusajs/framework/utils"
import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { BUNDLE_PROMOTIONS } from "../lib/bundle-pricing"
import { ensurePromotionRule, noBundleRule, oneTimeRule, subscriptionRule } from "../lib/promotion-rules"

const ensureBundlePromotionsStep = createStep("ensure-bundle-promotions", async (_, { container }) => {
  const service = container.resolve(Modules.PROMOTION)
  const created: string[] = []
  const updated: string[] = []

  // Restrict existing coupons before enabling automatic bundles.
  const coupons = await service.listPromotions(
    { code: ["SUBSCRIBE20", "ILOVEAURA"] }, { relations: ["rules", "rules.values"] }
  )
  for (const coupon of coupons) {
    await ensurePromotionRule(service, coupon.id, coupon.rules || [], noBundleRule)
    await ensurePromotionRule(service, coupon.id, coupon.rules || [], coupon.code === "SUBSCRIBE20" ? subscriptionRule : oneTimeRule)
  }

  for (const spec of BUNDLE_PROMOTIONS) {
    const rule = { attribute: "aura_bundle_tier", operator: "eq" as const, values: [String(spec.percent)] }
    const targetRule = { attribute: "items.product_handle", operator: "eq" as const, values: ["aura-patch"] }
    const method = { type: "percentage" as const, target_type: "items" as const, allocation: "across" as const, value: spec.percent }
    const [existing] = await service.listPromotions(
      { code: spec.code },
      { relations: ["rules", "rules.values", "application_method", "application_method.target_rules", "application_method.target_rules.values"] }
    )
    if (!existing) {
      await service.createPromotions({
        code: spec.code, type: "standard", status: "active", is_automatic: true,
        rules: [rule], application_method: { ...method, target_rules: [targetRule] },
      })
      created.push(spec.code)
      continue
    }
    // Add eligibility before changing an existing unrestricted manual code.
    await ensurePromotionRule(service, existing.id, existing.rules || [], rule)
    await ensurePromotionRule(service, existing.id, existing.application_method?.target_rules || [], targetRule, true)
    const current = existing.application_method
    if (!existing.is_automatic || existing.status !== "active" ||
      current?.type !== method.type || current?.target_type !== method.target_type ||
      current?.allocation !== method.allocation || Number(current?.value) !== spec.percent) {
      await service.updatePromotions({
        id: existing.id, type: "standard", status: "active", is_automatic: true, application_method: method,
      })
      updated.push(spec.code)
    }
  }
  return new StepResponse({ created, updated })
})

export const ensureBundlePromotionsWorkflow = createWorkflow("ensure-bundle-promotions", () =>
  new WorkflowResponse(ensureBundlePromotionsStep())
)
