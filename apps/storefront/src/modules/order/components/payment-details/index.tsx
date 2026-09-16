import { Heading, Text } from "@modules/common/components/ui"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const paymentInfo = payment ? paymentInfoMap[payment.provider_id] : undefined

  return (
    <div>
      <Heading
        level="h2"
        className="aura-display text-[28px] font-normal leading-none"
      >
        Payment
      </Heading>
      {payment && (
        <div className="mt-6 grid grid-cols-1 gap-6 small:grid-cols-2">
          <div>
            <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-aura-forest/50">
              Payment method
            </Text>
            <Text
              className="text-[14px] leading-6 text-aura-forest/75"
              data-testid="payment-method"
            >
              {paymentInfo?.title ?? "Payment"}
            </Text>
          </div>
          <div>
            <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-aura-forest/50">
              Payment details
            </Text>
            <Text
              className="text-[14px] leading-6 text-aura-forest/75"
              data-testid="payment-amount"
            >
              {isStripeLike(payment.provider_id) && payment.data?.card_last4
                ? `**** **** **** ${payment.data.card_last4}`
                : `${convertToLocale({
                    amount: payment.amount,
                    currency_code: order.currency_code,
                  })} paid at ${new Date(
                    payment.created_at ?? ""
                  ).toLocaleString()}`}
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentDetails
