import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col gap-5 rounded-[1.5rem] border border-aura-forest/15 px-6 py-6 small:flex-row small:items-center small:justify-between small:px-8">
      <div>
        <Heading
          level="h2"
          className="aura-display text-[28px] leading-tight small:text-[32px]"
        >
          Already have an account?
        </Heading>
        <Text className="mt-2 text-[14px] text-aura-forest/65">
          Sign in for a better experience.
        </Text>
      </div>
      <div className="shrink-0">
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-11 rounded-full !border-aura-forest/25 !bg-transparent px-6 text-[11px] font-bold uppercase tracking-[0.14em] !text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
