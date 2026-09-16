"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="z-50 h-full"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="text-[12px] uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
            href="/cart"
            data-testid="nav-cart-link"
          >{`Cart (${totalItems})`}</LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="absolute right-0 top-[calc(100%+12px)] hidden w-[400px] overflow-hidden rounded-[1.5rem] border border-aura-forest/15 bg-[#f5efe4] text-aura-forest shadow-[0_18px_50px_rgba(25,63,55,0.12)] small:block"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-end justify-between border-b border-aura-forest/10 px-6 py-5">
              <h3 className="aura-display text-[28px] font-normal leading-none">
                Your cart
              </h3>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-aura-forest/50">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="no-scrollbar grid max-h-[402px] grid-cols-1 gap-y-6 overflow-y-scroll px-6 py-5">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[88px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-[72px]"
                        >
                          <Thumbnail
                            thumbnail={
                              item.product_handle === "aura-patch"
                                ? "/images/aura-patch-front-original.jpeg"
                                : item.thumbnail
                            }
                            images={item.variant?.product?.images}
                            size="square"
                            className="!rounded-[1.25rem] !border !border-aura-forest/10 !bg-[#f7f4ed] !p-0 !shadow-none"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div className="mr-2 min-w-0 flex-1">
                              <h3 className="overflow-hidden text-ellipsis text-[15px] font-semibold leading-5 text-aura-forest">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>
                              <div className="mt-1 text-[12px] text-aura-forest/55">
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                              </div>
                              <span
                                className="mt-1 block text-[12px] text-aura-forest/55"
                                data-testid="cart-item-quantity"
                                data-value={item.quantity}
                              >
                                Quantity: {item.quantity}
                              </span>
                            </div>
                            <div className="shrink-0 text-[14px] font-semibold text-aura-forest">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-2"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex flex-col gap-y-4 border-t border-aura-forest/10 px-6 py-5">
                  <div className="flex items-end justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-aura-forest/55">
                      Subtotal
                    </span>
                    <span
                      className="aura-display text-[28px] leading-none"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart">
                    <Button
                      className="min-h-12 w-full rounded-full !bg-aura-gold px-6 text-[11px] font-bold uppercase tracking-[0.16em] !text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
                      data-testid="go-to-cart-button"
                    >
                      Go to cart
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start px-6 py-10">
                <span className="aura-eyebrow text-aura-gold">
                  Your bag is waiting
                </span>
                <p className="aura-display mt-3 text-[32px] leading-none">
                  Your cart is empty
                </p>
                <LocalizedClientLink
                  href="/store"
                  className="aura-button mt-6 inline-flex"
                  onClick={close}
                >
                  Explore products
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
