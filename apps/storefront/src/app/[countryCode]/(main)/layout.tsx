import { Metadata } from "next"
import { Suspense } from "react"

import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import CartMismatchBannerLoader from "@modules/layout/components/cart-mismatch-banner/loader"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import WelcomePopup from "@modules/layout/components/welcome-popup"
import FloatingBuyNowLoader from "@modules/layout/components/floating-buy-now/loader"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

async function LoggedInBanners() {
  const customer = await retrieveCustomer()

  if (!customer) {
    return null
  }

  return <CartMismatchBannerLoader customer={customer} />
}

export default async function PageLayout(props: { children: React.ReactNode; params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params

  return (
    <>
      <Suspense fallback={<div className="h-[66px] bg-[#17382f]" />}>
        <Nav />
      </Suspense>
      <Suspense fallback={null}>
        <LoggedInBanners />
      </Suspense>
      <WelcomePopup />
      {props.children}
      <Footer />
      <Suspense fallback={null}>
        <FloatingBuyNowLoader countryCode={countryCode} />
      </Suspense>
    </>
  )
}
