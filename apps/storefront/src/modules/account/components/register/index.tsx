"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="flex w-full flex-col rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] px-6 py-8 font-sans small:px-8 small:py-10"
      data-testid="register-page"
    >
      <span className="aura-eyebrow text-aura-gold">Account</span>
      <h1 className="aura-display mt-3 text-[40px] font-normal leading-none small:text-[48px]">
        Create an account
      </h1>
      <p className="mt-4 mb-8 font-sans text-[15px] leading-7 text-aura-forest/65">
        Join Aura Patch for a simpler checkout and a more personal shopping
        experience.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="mb-6 rounded-[1.25rem] border border-aura-forest/15 bg-aura-cream px-4 py-4 text-center text-[14px] leading-6 text-aura-forest/75"
          data-testid="register-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please check your inbox to verify your email, then sign in.
        </div>
      )}
      <form className="flex w-full flex-col" action={formAction}>
        <div className="flex w-full flex-col gap-y-3">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            variant="aura"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            variant="aura"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            variant="aura"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            variant="aura"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            variant="aura"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />
        <p className="mt-6 text-center text-[13px] leading-6 text-aura-forest/60">
          By creating an account, you agree to Aura Patch&apos;s{" "}
          <LocalizedClientLink
            href="/privacy"
            className="font-semibold text-aura-forest underline decoration-aura-gold/70 underline-offset-4 hover:text-aura-gold"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/terms"
            className="font-semibold text-aura-forest underline decoration-aura-gold/70 underline-offset-4 hover:text-aura-gold"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </p>
        <SubmitButton
          className="mt-6 min-h-12 w-full rounded-full !bg-aura-wine px-6 text-[11px] font-bold uppercase tracking-[0.16em] !text-aura-cream hover:!bg-aura-forest hover:!text-aura-cream"
          data-testid="register-button"
        >
          Join
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-[14px] text-aura-forest/65">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-semibold text-aura-forest underline decoration-aura-gold/70 underline-offset-4 hover:text-aura-gold"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register
