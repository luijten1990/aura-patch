import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { ProductJsonLd, FAQJsonLd, OrganizationJsonLd, WebsiteJsonLd } from "@modules/seo/json-ld"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Aura Core — Daily Wellness Patch",
  description:
    "Aura Core is the everyday Aura ritual: 19 ingredients in one daily patch. Peel, apply, go. 30-day pouch.",
  openGraph: {
    title: "The Aura Collection — Core, Restore, Energy",
    description: "Three formulas. One daily ritual. Start with Core, the daily wellness patch.",
    images: ["/images/aura-core-front.jpeg"],
    type: "website",
    siteName: "Aura Patch",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aura Collection — Core, Restore, Energy",
    description: "Three formulas. One daily ritual. Start with Core, the daily wellness patch.",
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
