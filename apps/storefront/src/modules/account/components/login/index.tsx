import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="flex w-full flex-col rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] px-6 py-8 font-sans small:px-8 small:py-10"
      data-testid="login-page"
    >
      <span className="aura-eyebrow text-aura-gold">Account</span>
      <h1 className="aura-display mt-3 text-[40px] font-normal leading-none small:text-[48px]">
        Welcome back
      </h1>
      <p className="mt-4 mb-8 font-sans text-[15px] leading-7 text-aura-forest/65">
        Sign in to access an enhanced shopping experience.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="mb-6 rounded-[1.25rem] border border-aura-forest/15 bg-aura-cream px-4 py-4 text-center text-[14px] leading-6 text-aura-forest/75"
          data-testid="login-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please verify your email, then sign in.
        </div>
      )}
      <form className="w-full" action={formAction}>
        <div className="flex w-full flex-col gap-y-3">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            variant="aura"
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            variant="aura"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton
          data-testid="sign-in-button"
          className="mt-6 min-h-12 w-full rounded-full !bg-aura-gold px-6 text-[11px] font-bold uppercase tracking-[0.16em] !text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
        >
          Sign in
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-[14px] text-aura-forest/65">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-semibold text-aura-forest underline decoration-aura-gold/70 underline-offset-4 hover:text-aura-gold"
          data-testid="register-button"
        >
          Join us
        </button>
      </p>
    </div>
  )
}

export default Login
