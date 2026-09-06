import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { ProductJsonLd, FAQJsonLd, OrganizationJsonLd, WebsiteJsonLd } from "@modules/seo/json-ld"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Aura Patch — 19 Ingredients, One Daily Wellness Patch",
  description:
    "Aura Patch is a pill-free daily wellness patch with 19 ingredients delivered transdermally. Support immune health, energy & recovery — peel, apply, go. 30-day supply.",
  openGraph: {
    title: "Aura Patch — Daily Wellness, Simplified",
    description: "19 ingredients in one daily transdermal patch. No pills, no powders — just peel, apply, and go.",
    images: ["/images/aura-patch-front-original.jpeg"],
    type: "website",
    siteName: "Aura Patch",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Patch — Daily Wellness, Simplified",
    description: "19 ingredients in one daily transdermal patch. No pills, no powders — just peel, apply, and go.",
  },
  alternates: {
    canonical: "https://www.getaurapatch.com/us",
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 1 },
  })

  return (
    <>
      <ProductJsonLd />
      <FAQJsonLd />
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <Hero product={products[0]} region={region} />
    </>
  )
}
