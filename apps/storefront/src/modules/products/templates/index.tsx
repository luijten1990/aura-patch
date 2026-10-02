import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import AuraIngredientsGallery from "@modules/products/components/aura-ingredients-gallery"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const displayImages =
    product.handle === "aura-patch"
      ? [
          {
            id: "aura-patch-front",
            url: "/images/aura-core-front.webp",
            rank: 0,
          },
          {
            id: "aura-patch-back",
            url: "/images/aura-patch-back-transparent.png",
            rank: 1,
          },
        ]
      : images

  return (
    <>
      <div
        className="content-container grid gap-8 py-8 relative small:grid-cols-[1.1fr_1fr] small:gap-16 small:items-start small:py-12"
        data-testid="product-container"
      >
        <div className="w-full relative small:sticky small:top-24">
          <ImageGallery images={displayImages} />
        </div>
        <div className="relative flex w-full flex-col gap-y-7">
          <ProductInfo product={product} />
          <Suspense
            fallback={
              <div
                className="min-h-[350px]"
                aria-label="Loading purchase options"
              />
            }
          >
            <ProductActions product={product} region={region} />
          </Suspense>
          <ProductTabs product={product} />
          <a
            href="#customer-reviews"
            className="text-sm underline underline-offset-4"
          >
            Customer reviews
          </a>
        </div>
      </div>
      <section
        id="customer-reviews"
        aria-labelledby="customer-reviews-title"
        className="content-container scroll-mt-24 border-t border-aura-forest/15 py-12"
      >
        <h2 id="customer-reviews-title" className="aura-display text-[36px]">
          Customer reviews
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7">
          No customer reviews have been published here yet.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7">
          Have experience with Aura Core?{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:support@getaurapatch.com?subject=Aura%20Core%20feedback"
          >
            Share your feedback with Aura.
          </a>
        </p>
      </section>
      {product.handle === "aura-patch" && <AuraIngredientsGallery />}
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
