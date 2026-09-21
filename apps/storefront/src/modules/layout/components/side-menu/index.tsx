"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"

const SideMenuItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/store" },
  { name: "Collection", href: "/#collection" },
  { name: "Ingredients", href: "/#formulations" },
  { name: "Science", href: "/#science" },
  { name: "FAQ", href: "/#faq" },
  { name: "Contact", href: "/#contact" },
]

const SideMenuAccountItems = [
  { name: "Account", href: "/account" },
  { name: "Cart", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const [open, setOpen] = useState(false)
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const close = () => setOpen(false)

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <button
          type="button"
          data-testid="nav-menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative z-[90] flex h-full items-center gap-2.5 text-[12px] uppercase tracking-[0.08em] text-[#f6f0e5] transition-opacity hover:opacity-70 focus:outline-none"
        >
          <span className="relative flex h-3.5 w-[18px] flex-col justify-between" aria-hidden>
            <span
              className={`h-px w-full bg-current transition-transform duration-200 ${
                open ? "translate-y-[6.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-200 ${
                open ? "-translate-y-[6.5px] -rotate-45" : ""
              }`}
            />
          </span>
          Menu
        </button>

        {open && (
          <div className="fixed inset-0 z-[80]">
            <button
              type="button"
              className="absolute inset-0 bg-aura-forest/70 backdrop-blur-sm"
              onClick={close}
              data-testid="side-menu-backdrop"
              aria-label="Close menu"
            />
            <div
              data-testid="nav-menu-popup"
              className="relative mx-3 mt-[4.6rem] flex max-h-[calc(100dvh-5.4rem)] flex-col overflow-hidden rounded-[1.75rem] bg-aura-cream text-aura-forest shadow-[0_24px_80px_rgba(23,56,47,0.28)] small:mx-auto small:max-w-[420px]"
            >
              <div className="h-1.5 bg-aura-gold" />
              <div className="flex items-center justify-between px-6 py-5">
                <p className="aura-eyebrow text-aura-gold">Aura Patch</p>
                <button
                  type="button"
                  data-testid="close-menu-button"
                  onClick={close}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-aura-forest/20 text-xl leading-none text-aura-forest transition-colors hover:bg-aura-forest hover:text-aura-cream"
                >
                  ×
                </button>
              </div>
              <nav className="overflow-y-auto px-6 pb-7">
                <ul className="flex flex-col">
                  {SideMenuItems.map(({ name, href }) => (
                    <li key={name} className="border-t border-aura-forest/10">
                      <LocalizedClientLink
                        href={href}
                        className="flex min-h-12 items-center text-[13px] uppercase tracking-[0.14em] transition-colors hover:text-aura-gold"
                        onClick={close}
                        data-testid={`${name.toLowerCase()}-link`}
                      >
                        {name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {SideMenuAccountItems.map(({ name, href }) => (
                    <LocalizedClientLink
                      key={name}
                      href={href}
                      onClick={close}
                      data-testid={`${name.toLowerCase()}-link`}
                      className="flex min-h-12 items-center justify-center rounded-full border border-aura-forest/20 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-aura-forest hover:bg-aura-forest hover:text-aura-cream"
                    >
                      {name}
                    </LocalizedClientLink>
                  ))}
                </div>
                <div className="mt-6 rounded-[1.15rem] border border-aura-forest/15 bg-white/50 px-4 py-3 text-[12px] text-aura-forest">
                  {!!locales?.length && (
                    <div
                      className="mb-3 border-b border-aura-forest/10 pb-3"
                      onMouseEnter={languageToggleState.open}
                      onMouseLeave={languageToggleState.close}
                    >
                      <LanguageSelect
                        toggleState={languageToggleState}
                        locales={locales}
                        currentLocale={currentLocale}
                      />
                    </div>
                  )}
                  {regions && (
                    <div
                      onMouseEnter={countryToggleState.open}
                      onMouseLeave={countryToggleState.close}
                    >
                      <CountrySelect
                        toggleState={countryToggleState}
                        regions={regions}
                        dropdownPlacement="top"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-5 text-[11px] tracking-[0.04em] text-aura-forest/50">
                  © 2026 Aura Patch. All rights reserved.
                </p>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideMenu
