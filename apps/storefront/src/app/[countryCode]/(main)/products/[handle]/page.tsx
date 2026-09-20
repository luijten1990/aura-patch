import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

export const revalidate = 300

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  // Skip Medusa at build time so Hostinger deploys cannot 503.
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const product = await getProductByHandle(params.countryCode, params.handle)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Aura Patch`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Aura Patch`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const [region, pricedProduct] = await Promise.all([
    getRegion(params.countryCode),
    getProductByHandle(params.countryCode, params.handle),
  ])

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
