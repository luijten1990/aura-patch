"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@modules/common/components/ui"
import { confirmEmailVerification } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type VerificationState = "verifying" | "success" | "error"

const VerifyAccount = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, setState] = useState<VerificationState>("verifying")
  // Guard against the effect running twice in React Strict Mode, which would
  // consume the single-use token before the customer sees the result.
  const confirmed = useRef(false)

  useEffect(() => {
    if (confirmed.current) {
      return
    }
    confirmed.current = true

    if (!token) {
      setState("error")
      return
    }

    confirmEmailVerification(token).then(({ success }) =>
      setState(success ? "success" : "error")
    )
  }, [token])

  return (
    <div
      className="flex w-full max-w-[440px] flex-col items-center rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] px-6 py-8 text-center small:px-8 small:py-10"
      data-testid="verify-account-page"
    >
      <span className="aura-eyebrow text-aura-gold">Account</span>
      <h1 className="aura-display mt-3 text-[40px] font-normal leading-none small:text-[48px]">
        Email verification
      </h1>

      {state === "verifying" && (
        <p className="mt-4 text-[15px] leading-7 text-aura-forest/65">
          Verifying your email...
        </p>
      )}

      {state === "success" && (
        <>
          <p className="mt-4 text-[15px] leading-7 text-aura-forest/65">
            Your email is verified. You can now sign in to your account.
          </p>
          <LocalizedClientLink href="/account" className="mt-6">
            <Button
              variant="primary"
              className="min-h-12 rounded-full !bg-aura-wine px-6 text-[11px] font-bold uppercase tracking-[0.16em] !text-aura-cream hover:!bg-aura-forest hover:!text-aura-cream"
            >
              Go to sign in
            </Button>
          </LocalizedClientLink>
        </>
      )}

      {state === "error" && (
        <>
          <p className="mt-4 text-[15px] leading-7 text-aura-forest/65">
            This verification link is invalid or has expired. Sign in to receive
            a new verification email.
          </p>
          <LocalizedClientLink href="/account" className="mt-6">
            <Button
              variant="secondary"
              className="min-h-12 rounded-full border-aura-forest/20 bg-[#f7f4ed] px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
            >
              Go to sign in
            </Button>
          </LocalizedClientLink>
        </>
      )}
    </div>
  )
}

export default VerifyAccount
