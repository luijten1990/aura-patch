import React from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div
      className="min-h-[70vh] flex-1 bg-aura-cream py-12 text-aura-forest small:py-20"
      data-testid="account-page"
    >
      <div className="content-container flex h-full max-w-5xl flex-col">
        {customer ? (
          <div className="grid grid-cols-1 py-4 small:grid-cols-[240px_1fr] small:py-0">
            <div>
              <AccountNav customer={customer} />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        ) : (
          <div className="flex flex-1 justify-center py-4 small:py-8">
            {children}
          </div>
        )}
        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-aura-forest/15 pt-8 small:flex-row small:items-end">
          <div>
            <h3 className="aura-display text-[28px] font-normal leading-none">
              Got questions?
            </h3>
            <p className="mt-3 max-w-[28rem] text-[15px] leading-7 text-aura-forest/65">
              You can find frequently asked questions and answers on our FAQ
              page.
            </p>
          </div>
          <LocalizedClientLink href="/#faq" className="aura-button-outline">
            View FAQ
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
