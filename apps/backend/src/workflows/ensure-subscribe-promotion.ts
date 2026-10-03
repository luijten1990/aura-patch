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
    const existing = await promotionModule.listPromotions(
      { code: SUBSCRIBE_CODE },
      { relations: ["application_method"] }
    )
    const applicationMethod = {
      type: "percentage" as const,
      target_type: "items" as const,
      allocation: "across" as const,
      value: SUBSCRIBE_PERCENT,
    }

    if (existing.length) {
      const promotion = existing[0]
      const method = promotion.application_method
      const current = method ? Number(method.value) : null
      const needsUpdate =
        promotion.status !== "active" ||
        method?.type !== "percentage" ||
        method?.target_type !== "items" ||
        current !== SUBSCRIBE_PERCENT

      if (needsUpdate) {
        await promotionModule.updatePromotions({
          id: promotion.id,
          status: "active",
          type: "standard",
          application_method: applicationMethod,
        })
      }

      return new StepResponse({
        code: SUBSCRIBE_CODE,
        created: false,
        updated: needsUpdate,
      })
    }

    try {
      await promotionModule.createPromotions({
        code: SUBSCRIBE_CODE,
        type: "standard",
        status: "active",
        is_automatic: false,
        application_method: applicationMethod,
      })
    } catch (error) {
      const later = await promotionModule.listPromotions({
        code: SUBSCRIBE_CODE,
      })

      if (!later.length) {
        throw error
      }
    }

    return new StepResponse({
      code: SUBSCRIBE_CODE,
      created: true,
      updated: false,
    })
  }
)

export const ensureSubscribePromotionWorkflow = createWorkflow(
  "ensure-subscribe-promotion",
  () => {
    const result = ensureSubscribePromotionStep()
    return new WorkflowResponse(result)
  }
)
