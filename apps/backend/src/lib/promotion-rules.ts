import { IPromotionModuleService, PromotionRuleDTO } from "@medusajs/framework/types"

export const noBundleRule = {
  attribute: "aura_bundle_tier", operator: "eq" as const, values: ["0"],
}
export const subscriptionRule = {
  attribute: "aura_subscription", operator: "eq" as const, values: ["true"],
}
export const oneTimeRule = { ...subscriptionRule, values: ["false"] }

export async function ensurePromotionRule(
  service: IPromotionModuleService,
  promotionId: string,
  rules: PromotionRuleDTO[],
  rule: { attribute: string; operator: "eq"; values: string[] },
  target = false
) {
  const matches = rules.filter((entry) => entry.attribute === rule.attribute)
  if (!matches.length) {
    if (target) await service.addPromotionTargetRules(promotionId, [rule])
    else await service.addPromotionRules(promotionId, [rule])
    return
  }
  for (const current of matches) {
    const values = (current.values || []).map((entry) => entry.value)
    if (current.operator !== rule.operator || JSON.stringify(values) !== JSON.stringify(rule.values)) {
      await service.updatePromotionRules([{ id: current.id, ...rule }])
    }
  }
}
