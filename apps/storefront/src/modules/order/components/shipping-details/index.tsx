import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading
        level="h2"
        className="aura-display text-[28px] font-normal leading-none"
      >
        Delivery
      </Heading>
      <div className="mt-6 grid grid-cols-1 gap-6 small:grid-cols-3">
        <div data-testid="shipping-address-summary">
          <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-aura-forest/50">
            Shipping address
          </Text>
          <Text className="text-[14px] leading-6 text-aura-forest/75">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="text-[14px] leading-6 text-aura-forest/75">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="text-[14px] leading-6 text-aura-forest/75">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="text-[14px] leading-6 text-aura-forest/75">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div data-testid="shipping-contact-summary">
          <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-aura-forest/50">
            Contact
          </Text>
          <Text className="text-[14px] leading-6 text-aura-forest/75">
            {order.shipping_address?.phone}
          </Text>
          <Text className="text-[14px] leading-6 text-aura-forest/75">
            {order.email}
          </Text>
        </div>

        <div data-testid="shipping-method-summary">
          <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-aura-forest/50">
            Method
          </Text>
          <Text className="text-[14px] leading-6 text-aura-forest/75">
            {(order.shipping_methods?.[0] as { name?: string })?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0]?.total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
