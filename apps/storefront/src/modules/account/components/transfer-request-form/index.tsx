"use client"
import { createTransferRequest } from "@lib/data/orders"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { IconButton, Input, Text } from "@modules/common/components/ui"
import { useActionState } from "react"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useEffect, useState } from "react"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="grid w-full items-center gap-x-8 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1">
          <h3 className="aura-display text-[24px] font-normal leading-none">
            Order transfers
          </h3>
          <p className="text-[14px] leading-6 text-aura-forest/55">
            Can&apos;t find the order you are looking for?
            <br /> Connect an order to your account.
          </p>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-1 sm:items-end"
        >
          <div className="flex w-full flex-col gap-y-2">
            <Input className="w-full" name="order_id" placeholder="Order ID" />
            <SubmitButton
              variant="secondary"
              size="small"
              className="w-fit self-end whitespace-nowrap rounded-full border-aura-forest/20 bg-[#f5efe4] text-[11px] font-bold uppercase tracking-[0.14em] text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
            >
              Request transfer
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <Text className="text-right text-[14px] text-rose-500">
          {state.error}
        </Text>
      )}
      {showSuccess && (
        <div className="flex w-full items-center justify-between self-stretch rounded-[1.25rem] border border-aura-forest/15 bg-[#f5efe4] p-4">
          <div className="flex items-center gap-x-2">
            <CheckCircleMiniSolid className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col gap-y-1">
              <Text className="text-[14px] text-aura-forest">
                Transfer for order {state.order?.id} requested
              </Text>
              <Text className="text-[14px] text-aura-forest/60">
                Transfer request email sent to {state.order?.email}
              </Text>
            </div>
          </div>
          <IconButton
            className="h-fit"
            onClick={() => setShowSuccess(false)}
          >
            <XCircleSolid className="h-4 w-4 text-aura-forest/50" />
          </IconButton>
        </div>
      )}
    </div>
  )
}
