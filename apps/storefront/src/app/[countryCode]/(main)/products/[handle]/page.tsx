import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import { auraCollection } from "@lib/data/aura-collection"
import ProductTemplate from "@modules/products/templates"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  // Skip Medusa at build time so Hostinger deploys cannot 503.
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    const product = await getProductByHandle(params.countryCode, params.handle)

    if (!product) {
      return {
        title: "Aura Patch",
        description: "Daily wellness patches from Aura.",
      }
    }

    const core = auraCollection.find((formula) => formula.key === "core")
    const description =
      product.handle === "aura-patch" && core
        ? core.description
        : product.description || product.title

    return {
      title: { absolute: `${product.title} | Aura Patch` },
      description,
      alternates: {
        canonical: `${getBaseURL()}/${params.countryCode}/products/${params.handle}`,
      },
      openGraph: {
        title: `${product.title} | Aura Patch`,
        description,
        images: ["/images/aura-core-pouch-front.jpeg"],
      },
    }
  } catch {
    return {
      title: "Aura Patch",
      description: "Daily wellness patches from Aura.",
    }
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  let region
  let pricedProduct

  try {
    ;[region, pricedProduct] = await Promise.all([
      getRegion(params.countryCode),
      getProductByHandle(params.countryCode, params.handle),
    ])
  } catch {
    notFound()
  }

  if (!region || !pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      images={pricedProduct.images ?? []}
    />
  )
}
