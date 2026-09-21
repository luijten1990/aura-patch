import { HttpTypes } from "@medusajs/types"
import { auraCore } from "@lib/data/aura-collection"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const isCore = product.handle === "aura-patch"

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-5 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <p className="text-[11px] uppercase tracking-[0.18em] text-aura-ember">
          {isCore ? auraCore.use : "Daily wellness"}
        </p>
        <span className="aura-spark" />
        <Heading
          level="h2"
          className="aura-display text-[46px] leading-none text-aura-forest"
          data-testid="product-title"
        >
          {isCore ? auraCore.name : product.title}
        </Heading>

        <Text
          className="text-[15px] leading-7 text-aura-forest/70 whitespace-pre-line"
          data-testid="product-description"
        >
          {isCore ? auraCore.description : product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
