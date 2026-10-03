import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

const BUNDLE_PROMOTIONS = [
  { code: "BUNDLE10", value: 10 },
  { code: "BUNDLE15", value: 15 },
  { code: "BUNDLE20", value: 20 },
]

const ensureBundlePromotionsStep = createStep(
  "ensure-bundle-promotions",
  async (_, { container }) => {
    const promotionModule = container.resolve(Modules.PROMOTION)
    const created: string[] = []

    for (const promotion of BUNDLE_PROMOTIONS) {
      const existing = await promotionModule.listPromotions({
        code: promotion.code,
      })

      if (existing.length) {
        continue
      }

      try {
        await promotionModule.createPromotions({
          code: promotion.code,
          type: "standard",
          status: "active",
          is_automatic: false,
          application_method: {
            type: "percentage",
            target_type: "items",
            allocation: "across",
            value: promotion.value,
          },
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
    }

    return new StepResponse({ created })
  }
)

export const ensureBundlePromotionsWorkflow = createWorkflow(
  "ensure-bundle-promotions",
  () => {
    const result = ensureBundlePromotionsStep()
    return new WorkflowResponse(result)
  }
)
