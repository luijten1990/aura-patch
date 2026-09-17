import { Metadata } from "next"
import { Suspense } from "react"

import VerifyAccount from "@modules/account/components/verify-account"

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Verify your email address to complete your registration.",
}

export default function VerifyAccountPage() {
  return (
    <div className="flex w-full justify-center bg-aura-cream px-8 py-12">
      <Suspense
        fallback={
          <p className="text-[15px] leading-7 text-aura-forest/65">
            Verifying your email...
          </p>
        }
      >
        <VerifyAccount />
      </Suspense>
    </div>
  )
}
