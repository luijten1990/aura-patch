import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { ProductJsonLd, FAQJsonLd, OrganizationJsonLd, WebsiteJsonLd } from "@modules/seo/json-ld"

export const revalidate = 300

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

export default async function Home() {
  return (
    <>
      <ProductJsonLd />
      <FAQJsonLd />
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <Hero />
    </>
  )
}
