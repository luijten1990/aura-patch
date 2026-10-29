import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { shopperProductName } from "@lib/data/aura-collection"

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

    const name = shopperProductName(product.handle, product.title)

    return {
      title: `${name} | Aura Patch`,
      description: name,
      openGraph: {
        title: `${name} | Aura Patch`,
        description: name,
        images: ["/images/aura-patch-pouch-front.jpeg"],
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
