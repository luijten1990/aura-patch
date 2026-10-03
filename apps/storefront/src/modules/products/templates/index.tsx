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
        {product.handle === "aura-patch" ? (
          <article className="mt-6 max-w-2xl border border-aura-forest/20 bg-white/30 p-6 small:p-8" aria-label="Review by Sheila Amos">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">Sheila Amos</p>
              <span role="img" aria-label="5 out of 5 stars" className="tracking-[0.12em] text-aura-forest">★★★★★</span>
            </div>
            <p className="mt-2 text-sm text-aura-forest/70">United States · <time dateTime="2026-05-03">May 3, 2026</time></p>
            <h3 className="mt-5 text-lg font-semibold">I love it</h3>
            <blockquote className="mt-2 text-base leading-7">“I love this patch.”</blockquote>
            <p className="mt-4 text-xs text-aura-forest/60">Featured review excerpt.</p>
          </article>
        ) : (
          <p className="mt-4 max-w-2xl text-base leading-7">No customer reviews have been published here yet.</p>
        )}
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
      {product.handle === "aura-patch" && (
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
            <figcaption className="mt-3 text-xs leading-5 text-aura-forest/60">AI-generated lifestyle illustration. Not a customer photograph.</figcaption>
          </figure>
          <div>
            <p className="aura-eyebrow">Made for everyday moments</p>
            <h2 id="everyday-aura-title" className="mt-4 font-sans text-[32px] leading-tight small:text-[40px]">A simple step in your daily routine.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-aura-forest/75">Peel, apply as directed, and carry on with your day. Discover the thinking behind Aura Core’s wearable format.</p>
            <a href={`/${countryCode}/why-a-patch`} className="aura-button-outline mt-6">Why a patch?</a>
          </div>
        </section>
      )}
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
