import { Metadata } from "next"

import { getProductByHandle } from "@lib/data/products"
import Hero from "@modules/home/components/hero"
import { ProductJsonLd, FAQJsonLd, OrganizationJsonLd, WebsiteJsonLd } from "@modules/seo/json-ld"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Aura Patch — Daily Wellness Patch",
  description:
    "Aura Patch is your daily defense. Wear one patch every day. Vitamin C, zinc, and vitamin A support normal immune function. Peel, apply, go. 30-day pouch.",
  openGraph: {
    title: "The Aura Collection — Aura Patch, Restore, Energy",
    description:
      "Next-generation daily wellness. Aura Patch, Restore, and Energy — three patches designed for all-day support. Start with Aura Patch.",
    images: ["/images/aura-patch-pouch-front.jpeg"],
    type: "website",
    siteName: "Aura Patch",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aura Collection — Aura Patch, Restore, Energy",
    description:
      "Next-generation daily wellness. Aura Patch, Restore, and Energy — three patches designed for all-day support. Start with Aura Patch.",
  },
  alternates: {
    canonical: "https://www.getaurapatch.com/us",
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const product = await getProductByHandle(countryCode, "aura-patch").catch(
    () => undefined
  )

  return (
    <>
      <ProductJsonLd />
      <FAQJsonLd />
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <Hero product={product} />
    </>
  )
}
