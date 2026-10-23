import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-start justify-center py-24"
      data-testid="empty-cart-message"
    >
      <span className="aura-eyebrow text-aura-gold">Your bag is waiting</span>
      <h1 className="aura-display mt-4 text-[52px] font-normal leading-none small:text-[72px]">
        Your cart is empty
      </h1>
      <Text className="mb-8 mt-5 max-w-[32rem] font-sans text-[16px] font-normal leading-7 text-aura-forest/65">
        Discover a beautifully simple daily wellness ritual, designed to fit
        naturally into modern life.
      </Text>
      <LocalizedClientLink href="/store" className="aura-button">
        Explore products
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
