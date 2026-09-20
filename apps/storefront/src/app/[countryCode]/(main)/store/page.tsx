import { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const { countryCode } = await props.params

  return <StoreTemplate countryCode={countryCode} />
}
