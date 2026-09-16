import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div>
      <Heading
        level="h2"
        className="aura-display text-[28px] font-normal leading-none"
      >
        Need help?
      </Heading>
      <ul className="mt-4 flex flex-col gap-y-2 text-[14px] text-aura-forest/70">
        <li>
          <LocalizedClientLink
            href="/contact"
            className="transition-colors hover:text-aura-gold"
          >
            Contact
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/contact"
            className="transition-colors hover:text-aura-gold"
          >
            Returns & Exchanges
          </LocalizedClientLink>
        </li>
      </ul>
    </div>
  )
}

export default Help
