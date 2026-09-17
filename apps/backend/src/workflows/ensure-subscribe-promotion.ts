import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { SUBSCRIBE_CODE, SUBSCRIBE_PERCENT } from "../modules/subscription/constants"

const ensureSubscribePromotionStep = createStep(
  "ensure-subscribe-promotion",
  async (_, { container }) => {
    const promotionModule = container.resolve(Modules.PROMOTION)
    const existing = await promotionModule.listPromotions({
      code: SUBSCRIBE_CODE,
    })

    if (existing.length) {
      return new StepResponse({ code: SUBSCRIBE_CODE, created: false })
    }

    try {
      await promotionModule.createPromotions({
        code: SUBSCRIBE_CODE,
        type: "standard",
        status: "active",
        is_automatic: false,
        application_method: {
          type: "percentage",
          target_type: "items",
          allocation: "across",
          value: SUBSCRIBE_PERCENT,
        },
      })
    } catch (error) {
      const later = await promotionModule.listPromotions({
        code: SUBSCRIBE_CODE,
      })

      if (!later.length) {
        throw error
      }
    }

    return new StepResponse({ code: SUBSCRIBE_CODE, created: true })
  }
)

export const ensureSubscribePromotionWorkflow = createWorkflow(
  "ensure-subscribe-promotion",
  () => {
    const result = ensureSubscribePromotionStep()
    return new WorkflowResponse(result)
  }
)
