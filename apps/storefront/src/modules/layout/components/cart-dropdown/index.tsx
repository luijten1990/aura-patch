"use client"

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { cartCurrencyCode, cartItemsAmount } from "@lib/util/cart-money"
import { CART_EVENT, type CartEventDetail } from "@lib/util/cart-events"
import type { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function CartDropdown({
  cart: initialCart,
}: {
  cart?: HttpTypes.StoreCart | null
}) {
  const [cart, setCart] = useState(initialCart)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setCart(initialCart)
  }, [initialCart])
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    const onCart = (event: Event) => {
      const detail = (event as CustomEvent<CartEventDetail>).detail
      setOpen(true)
      setPending(detail.status === "adding")
      setError(detail.status === "error" ? detail.message : null)
      if (detail.status === "updated") setCart(detail.cart)
    }
    window.addEventListener(CART_EVENT, onCart)
    return () => window.removeEventListener(CART_EVENT, onCart)
  }, [])

  const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const currency = cartCurrencyCode(cart)
  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex min-h-11 items-center text-[12px] uppercase tracking-[0.08em] hover:opacity-70"
        data-testid="nav-cart-link"
      >
        Cart ({count})
      </button>
      <Dialog open={open} onClose={close} className="relative z-[120]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 transition-opacity duration-200 data-[closed]:opacity-0 motion-reduce:transition-none"
        />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="flex h-full w-full max-w-[480px] flex-col bg-aura-cream text-aura-forest shadow-xl transition-transform duration-300 ease-out data-[closed]:translate-x-full motion-reduce:transition-none"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-between border-b border-aura-forest/15 px-6 py-5">
              <DialogTitle className="aura-display text-[32px]">
                Your cart <span className="font-sans text-sm">({count})</span>
              </DialogTitle>
              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-aura-forest/20 text-2xl"
                autoFocus
              >
                ×
              </button>
            </div>
            <div
              className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
              aria-busy={pending}
            >
              {pending && (
                <p
                  role="status"
                  className="mb-5 border-l-2 border-aura-gold pl-4 text-sm"
                >
                  Adding your item…
                </p>
              )}
              {error && (
                <p role="alert" className="mb-5 text-sm text-red-800">
                  {error}
                </p>
              )}
              {cart?.items?.length ? (
                <ul className="space-y-7">
                  {[...cart.items].reverse().map((item) => (
                    <li
                      key={item.id}
                      className="grid grid-cols-[80px_1fr] gap-4"
                      data-testid="cart-item"
                    >
                      <LocalizedClientLink
                        href={`/products/${item.product_handle}`}
                        onClick={close}
                      >
                        <Thumbnail
                          thumbnail={
                            item.product_handle === "aura-patch"
                              ? "/images/aura-core-front.webp"
                              : item.thumbnail
                          }
                          size="square"
                        />
                      </LocalizedClientLink>
                      <div className="min-w-0">
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          onClick={close}
                          className="text-base font-semibold"
                        >
                          {item.product_handle === "aura-patch"
                            ? "Aura Core"
                            : item.title}
                        </LocalizedClientLink>
                        <p className="mt-1 text-sm">
                          {item.metadata?.purchase_type === "subscription"
                            ? "Subscribe & Save · monthly"
                            : "One-time purchase"}
                        </p>
                        <p
                          className="mt-1 text-sm"
                          data-testid="cart-item-quantity"
                        >
                          Quantity: {item.quantity}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <LineItemPrice
                            item={item}
                            style="tight"
                            currencyCode={currency}
                          />
                          {!pending && (
                            <DeleteButton id={item.id}>Remove</DeleteButton>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : !pending && !error ? (
                <div className="py-12">
                  <p className="aura-display text-[34px]">
                    Your cart is empty.
                  </p>
                  <p className="mt-4 text-base leading-7">
                    Find a daily ritual that fits your day.
                  </p>
                  <LocalizedClientLink
                    href="/store"
                    onClick={close}
                    className="aura-button mt-6"
                  >
                    Explore products
                  </LocalizedClientLink>
                </div>
              ) : null}
            </div>
            <div className="border-t border-aura-forest/15 px-6 pt-5 pb-[max(24px,env(safe-area-inset-bottom))]">
              {!!cart?.items?.length && (
                <>
                  <div className="flex justify-between gap-4 text-lg">
                    <span>Item subtotal</span>
                    <strong data-testid="cart-subtotal">
                      {convertToLocale({
                        amount: cartItemsAmount(cart),
                        currency_code: currency,
                      })}
                    </strong>
                  </div>
                  <p className="mt-2 text-xs leading-5">
                    Shipping and taxes calculated at checkout.
                  </p>
                  {pending ? (
                    <p className="mt-5 text-sm">
                      Your cart will be ready in a moment.
                    </p>
                  ) : (
                    <LocalizedClientLink
                      href="/cart"
                      onClick={close}
                      className="aura-button mt-5 w-full"
                      data-testid="go-to-cart-button"
                    >
                      Review cart &amp; checkout
                    </LocalizedClientLink>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={close}
                className="mt-4 min-h-11 w-full text-sm underline underline-offset-4"
              >
                Continue shopping
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
