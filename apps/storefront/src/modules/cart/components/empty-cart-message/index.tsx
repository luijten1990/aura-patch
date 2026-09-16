import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-start justify-center py-24"
      data-testid="empty-cart-message"
    >
      <span className="aura-eyebrow text-aura-gold">Your bag is waiting</span>
      <Heading
        level="h1"
        className="aura-display mt-4 text-[52px] font-normal leading-none small:text-[72px]"
      >
        Your cart is empty
      </Heading>
      <Text className="mb-8 mt-5 max-w-[32rem] text-[16px] leading-7 text-aura-forest/65">
        Discover a beautifully simple daily wellness ritual, designed to fit
        naturally into modern life.
      </Text>
      <div className="aura-button inline-flex">
        <InteractiveLink href="/store">Explore products</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
