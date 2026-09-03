import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Aura Patch | Daily Wellness, Simplified",
  description:
    "Meet Aura Patch, a simple 30-day transdermal wellness ritual designed for modern life.",
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

  return <Hero product={products[0]} region={region} />
}
