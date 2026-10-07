import React, { Suspense } from "react"
import Image from "next/image"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import AuraIngredientsGallery from "@modules/products/components/aura-ingredients-gallery"
import AuraProductStage from "@modules/products/components/aura-product-stage"
import CustomerReviews from "@modules/products/components/customer-reviews"

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

  if (product.handle === "aura-patch") {
    return (
      <>
        <div
          className="content-container py-8 small:py-12"
          data-testid="product-container"
        >
          <AuraProductStage
            product={product}
            region={region}
            images={displayImages}
          />
        </div>
        <section className="content-container grid items-center gap-8 border-t border-aura-forest/15 py-12 small:grid-cols-2 small:gap-16" aria-labelledby="everyday-aura-title">
          <figure className="max-w-[480px]">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/aura-lifestyle-collage.png"
                alt="Illustration of a woman wearing a patch while sitting at her laptop"
                width={1536}
                height={1024}
                sizes="(max-width: 768px) 300vw, 1440px"
                className="absolute bottom-0 left-0 h-auto !w-[308%] !max-w-none"
              />
            </div>
          </figure>
          <div>
            <p className="aura-eyebrow">Made for everyday moments</p>
            <h2 id="everyday-aura-title" className="mt-4 font-sans text-[32px] leading-tight small:text-[40px]">A simple step in your daily routine.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-aura-forest/75">Peel, apply as directed, and carry on with your day. Discover the thinking behind Aura Core’s wearable format.</p>
            <a href={`/${countryCode}/why-a-patch`} className="aura-button-outline mt-6">Why a patch?</a>
          </div>
        </section>
        <AuraIngredientsGallery />
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
      <CustomerReviews featured={false} />
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
