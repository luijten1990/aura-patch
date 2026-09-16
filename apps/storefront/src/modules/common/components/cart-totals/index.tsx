"use client"

import { convertToLocale } from "@lib/util/money"
import { clx } from "@modules/common/components/ui"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
  variant?: "default" | "aura"
}

const CartTotals: React.FC<CartTotalsProps> = ({
  totals,
  variant = "default",
}) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div>
      <div
        className={clx(
          "flex flex-col",
          variant === "aura"
            ? "gap-y-3 text-[13px] text-aura-forest/65"
            : "gap-y-2 txt-medium text-ui-fg-subtle",
        )}
      >
        <div className="flex items-center justify-between">
          <span>
            {variant === "aura"
              ? "Subtotal"
              : "Subtotal (excl. shipping and taxes)"}
          </span>
          <span data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      <div
        className={clx(
          "h-px w-full border-b",
          variant === "aura"
            ? "my-5 border-aura-forest/15"
            : "my-4 border-gray-200",
        )}
      />
      <div
        className={clx(
          "mb-2 flex justify-between",
          variant === "aura"
            ? "items-end text-aura-forest"
            : "items-center txt-medium text-ui-fg-base",
        )}
      >
        <span
          className={clx(
            variant === "aura" &&
              "text-[11px] font-semibold uppercase tracking-[0.14em]",
          )}
        >
          Total
        </span>
        <span
          className={clx(
            variant === "aura"
              ? "aura-display text-[30px] leading-none"
              : "txt-xlarge-plus",
          )}
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      {variant === "default" && (
        <div className="mt-4 h-px w-full border-b border-gray-200" />
      )}
    </div>
  )
}

export default CartTotals
