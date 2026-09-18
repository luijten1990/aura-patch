import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import NavCountrySelect from "@modules/layout/components/nav-country-select"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="bg-[#17382f] text-[#f6f0e5]">
        <nav className="content-container relative z-[60] flex h-[66px] items-center justify-between overflow-visible">

          {/* Mobile menu */}
          <div className="small:hidden flex items-center">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          {/* Logo */}
          <LocalizedClientLink
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            data-testid="nav-store-link"
          >
            <span className="relative h-10 w-10 small:h-11 small:w-11">
              <Image
                src="/images/aura-logo-white.webp"
                alt=""
                fill
                priority
                className="aura-logo-mark object-contain"
                sizes="44px"
              />
            </span>
            <span className="aura-display text-[16px] leading-[0.9] tracking-[0.13em] text-[#aebfba] small:text-[18px]">
              AURA<br /><span className="text-[0.65em] tracking-[0.25em]">PATCH</span>
            </span>
          </LocalizedClientLink>

          {/* Desktop navigation */}
          <div className="hidden small:flex items-center justify-center gap-7 flex-1 text-[12px] tracking-[0.08em] uppercase">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-70 transition-opacity"
            >
              Home
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/store"
              className="hover:opacity-70 transition-opacity"
            >
              Shop
            </LocalizedClientLink>

            <LocalizedClientLink href="/#formulations" className="hover:opacity-70 transition-opacity">
              Ingredients
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/#science"
              className="hover:opacity-70 transition-opacity"
            >
              Science
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/#faq"
              className="hover:opacity-70 transition-opacity"
            >
              FAQ
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/#contact"
              className="hover:opacity-70 transition-opacity"
            >
              Contact
            </LocalizedClientLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 justify-end">
            <NavCountrySelect regions={regions} />

            <LocalizedClientLink
              href="/account"
              className="hidden small:block text-[12px] tracking-[0.08em] uppercase hover:opacity-70 transition-opacity"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  className="text-[13px] uppercase"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>

        </nav>
      </header>
    </div>
  )
}
