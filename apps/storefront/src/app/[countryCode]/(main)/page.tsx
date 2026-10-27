import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { ProductJsonLd, FAQJsonLd, OrganizationJsonLd, WebsiteJsonLd } from "@modules/seo/json-ld"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Aura Core — Daily Wellness Patch",
  description:
    "Aura Core is your daily defense. Wear one patch every day. Vitamin C, zinc, and vitamin A support normal immune function. Peel, apply, go. 30-day pouch.",
  openGraph: {
    title: "The Aura Collection — Core, Restore, Energy",
    description:
      "Next-generation daily wellness. Core, Restore, and Energy — three patches designed for all-day support. Start with Core.",
    images: ["/images/aura-core-pouch-front.jpeg"],
    type: "website",
    siteName: "Aura Patch",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aura Collection — Core, Restore, Energy",
    description:
      "Next-generation daily wellness. Core, Restore, and Energy — three patches designed for all-day support. Start with Core.",
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
