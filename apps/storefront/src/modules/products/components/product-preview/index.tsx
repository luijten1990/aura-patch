import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import Image from "next/image"
import QuickAddButton from "./quick-add-button"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const variant = product.variants?.[0]
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1
  const inStock = !!variant && (
    !variant.manage_inventory ||
    !!variant.allow_backorder ||
    (variant.inventory_quantity ?? 0) > 0
  )

  return (
    <article className="group block max-w-[430px]" data-testid="product-wrapper">
      <LocalizedClientLink href={`/products/${product.handle}`} className="block">
        {product.handle === "aura-patch" ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-aura-sage/45">
            <div className="absolute inset-[12%] rounded-full bg-aura-sage/75 blur-3xl" />
            <Image
              src="/images/aura-patch-front-original.jpeg"
              alt="Aura Patch 30-day pouch"
              fill
              className="object-contain p-5 mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.025] small:p-7"
              sizes="(max-width: 768px) 90vw, 430px"
            />
          </div>
        ) : (
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
            className="rounded-[2rem] bg-aura-sage/45 shadow-none"
          />
        )}
      </LocalizedClientLink>
        <div className="mt-5 flex items-end justify-between gap-5 border-t border-aura-forest/15 pt-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-aura-gold">Daily wellness</p>
            <LocalizedClientLink href={`/products/${product.handle}`}>
              <h2 className="aura-display mt-2 text-[34px] leading-none transition-colors hover:text-aura-gold" data-testid="product-title">
                {product.title}
              </h2>
            </LocalizedClientLink>
          </div>
          <div className="flex shrink-0 items-center text-[15px] font-semibold text-aura-forest">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          {hasMultipleVariants ? (
            <LocalizedClientLink href={`/products/${product.handle}`} className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-aura-gold px-6 text-[11px] font-bold uppercase tracking-[0.15em] text-aura-forest transition-colors hover:bg-aura-forest hover:text-aura-cream">
              Choose options
            </LocalizedClientLink>
          ) : (
            <QuickAddButton variantId={variant?.id} disabled={!inStock} />
          )}
          <LocalizedClientLink href={`/products/${product.handle}`} className="flex min-h-12 items-center justify-center rounded-full border border-aura-forest/25 px-6 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-aura-forest hover:bg-aura-forest hover:text-aura-cream">
            Details
          </LocalizedClientLink>
        </div>
    </article>
  )
}
