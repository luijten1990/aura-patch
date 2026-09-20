import { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Shop the Aura Collection",
  description: "Aura Core, Restore, and Energy — three daily rituals. Start with Core.",
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
