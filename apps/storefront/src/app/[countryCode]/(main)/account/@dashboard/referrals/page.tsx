import { redirect } from "next/navigation"

export default async function ReferralsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  redirect(`/${countryCode}/ambassadors/dashboard`)
}
