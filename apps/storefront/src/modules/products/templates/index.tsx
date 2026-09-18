import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
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
          { id: "aura-patch-front", url: "/images/aura-patch-front-original.jpeg", rank: 0 },
          { id: "aura-patch-back", url: "/images/aura-patch-back-original.jpeg", rank: 1 },
        ]
      : images

  return (
    <>
      <div
        className="content-container grid gap-10 py-10 relative small:grid-cols-[0.8fr_1.35fr_0.8fr] small:items-start small:py-16"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-28 w-full gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={displayImages} />
        </div>
        <div className="relative z-20 flex flex-col small:sticky small:top-28 w-full gap-y-8 rounded-[1.5rem] border border-aura-forest/10 bg-white/35 p-6">
          <ProductOnboardingCta />
          <ProductActions product={product} region={region} />
        </div>
      </div>
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
