import { AccountHolderDTO, CustomerDTO, PaymentMethodDTO } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { STRIPE_PROVIDER_ID } from "../../../modules/subscription/constants"

export interface GetPaymentMethodStepInput {
  customer?: CustomerDTO & {
    account_holders: AccountHolderDTO[]
  }
}

const getLatestPaymentMethod = (paymentMethods: PaymentMethodDTO[]) => {
  return paymentMethods.sort(
    (a, b) =>
      ((b.data?.created as number) ?? 0) - ((a.data?.created as number) ?? 0)
  )[0]
}

export const getPaymentMethodStep = createStep(
  "get-payment-method",
  async ({ customer }: GetPaymentMethodStepInput, { container }) => {
    const paymentModuleService = container.resolve(Modules.PAYMENT)
    const accountHolder = customer?.account_holders?.find(
      (holder) => holder.provider_id === STRIPE_PROVIDER_ID
    )

    if (!accountHolder) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No saved payment method was found for this subscription."
      )
    }

    const paymentMethods = await paymentModuleService.listPaymentMethods({
      provider_id: STRIPE_PROVIDER_ID,
      context: {
        account_holder: accountHolder,
      },
    })

    if (!paymentMethods.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "At least one saved payment method is required to renew a subscription."
      )
    }

    return new StepResponse(
      getLatestPaymentMethod(paymentMethods),
      accountHolder
    )
  }
)
