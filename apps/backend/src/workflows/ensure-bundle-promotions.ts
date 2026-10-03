import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BUNDLE_PROMOTIONS } from "../lib/bundle-pricing"

const ensureBundlePromotionsStep = createStep(
  "ensure-bundle-promotions",
  async (_, { container }) => {
    const promotionModule = container.resolve(Modules.PROMOTION)
    const created: string[] = []
    const updated: string[] = []

    for (const promotion of BUNDLE_PROMOTIONS) {
      const applicationMethod = {
        type: "percentage" as const,
        target_type: "items" as const,
        allocation: "across" as const,
        value: promotion.percent,
      }
      const existing = await promotionModule.listPromotions(
        { code: promotion.code },
        { relations: ["application_method"] }
      )

      if (!existing.length) {
        try {
          await promotionModule.createPromotions({
            code: promotion.code,
            type: "standard",
            status: "active",
            is_automatic: false,
            application_method: applicationMethod,
          })
          created.push(promotion.code)
        } catch (error) {
          const later = await promotionModule.listPromotions({
            code: promotion.code,
          })

          if (!later.length) {
            throw error
          }
        }
        continue
      }

      const current = existing[0]
      const method = current.application_method
      const currentValue = method ? Number(method.value) : null
      const needsUpdate =
        current.status !== "active" ||
        method?.type !== "percentage" ||
        method?.target_type !== "items" ||
        currentValue !== promotion.percent

      if (needsUpdate) {
        await promotionModule.updatePromotions({
          id: current.id,
          status: "active",
          type: "standard",
          application_method: applicationMethod,
        })
        updated.push(promotion.code)
      }
    }

    return new StepResponse({ created, updated })
  }
)

export const ensureBundlePromotionsWorkflow = createWorkflow(
  "ensure-bundle-promotions",
  () => {
    const result = ensureBundlePromotionsStep()
    return new WorkflowResponse(result)
  }
)
