import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="text-[15px] leading-7 text-aura-forest/70">
      <Text className="text-[15px] leading-7 text-aura-forest/70">
        We have sent the order confirmation details to{" "}
        <span className="font-semibold text-aura-forest" data-testid="order-email">
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2 text-[15px] leading-7 text-aura-forest/70">
        Order date:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-[15px] leading-7 text-aura-forest">
        Order number:{" "}
        <span className="font-semibold" data-testid="order-id">
          {order.display_id}
        </span>
      </Text>

      {showStatus && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-aura-forest/60">
          <Text className="text-[13px] text-aura-forest/60">
            Order status:{" "}
            <span className="text-aura-forest" data-testid="order-status">
              {formatStatus(order.fulfillment_status)}
            </span>
          </Text>
          <Text className="text-[13px] text-aura-forest/60">
            Payment status:{" "}
            <span className="text-aura-forest" data-testid="order-payment-status">
              {formatStatus(order.payment_status)}
            </span>
          </Text>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
