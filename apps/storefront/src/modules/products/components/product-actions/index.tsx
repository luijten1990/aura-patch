"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { convertToLocale } from "@lib/util/money"
import {
  SUBSCRIBE_PERCENT,
  subscriptionAmount,
  type PurchaseType,
} from "@lib/util/subscription"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription")
  const addingRef = useRef(false)
  const params = useParams()
  const countryCode = (
    Array.isArray(params.countryCode)
      ? params.countryCode[0]
      : params.countryCode
  ) as string

  const [options, setOptions] = useState<Record<string, string | undefined>>(
    () => {
      if (product.variants?.length === 1) {
        return optionsAsKeymap(product.variants[0].options) ?? {}
      }
      return {}
    }
  )

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    const matched = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
    if (matched) {
      return matched
    }

    const variantFromUrl = searchParams.get("v_id")
    return (
      product.variants.find((variant) => variant.id === variantFromUrl) ||
      product.variants[0]
    )
  }, [product.variants, options, searchParams])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    if ((product.variants?.length ?? 0) <= 1) {
      return true
    }
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (isAdding || params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant, isAdding])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async (nextPurchaseType: PurchaseType = purchaseType) => {
    const variantId = selectedVariant?.id || product.variants?.[0]?.id
    if (!variantId || addingRef.current) {
      return
    }

    addingRef.current = true
    setPurchaseType(nextPurchaseType)
    setAddError(null)
    setIsAdding(true)

    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode: countryCode || "us",
        purchaseType: nextPurchaseType,
      })
      router.push(`/${countryCode || "us"}/cart`)
      router.refresh()
    } catch (error) {
      addingRef.current = false
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not add Aura Patch to the cart. Please try again."
      setAddError(
        message.toLowerCase().includes("server components")
          ? "Could not add Aura Patch to the cart. Please try again."
          : message
      )
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-5" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice
          product={product}
          variant={selectedVariant}
          purchaseType={purchaseType}
        />

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={isAdding}
            onClick={() => {
              void handleAddToCart("subscription")
            }}
            className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
              purchaseType === "subscription"
                ? "border-aura-gold bg-aura-gold/15"
                : "border-aura-forest/15 bg-white/40"
            }`}
            data-testid="subscribe-option"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-aura-forest">
                Subscribe & Save {SUBSCRIBE_PERCENT}%
              </span>
              {selectedVariant?.calculated_price?.calculated_amount != null && (
                <span className="text-[14px] font-semibold text-aura-forest">
                  {convertToLocale({
                    amount: subscriptionAmount(
                      selectedVariant.calculated_price.calculated_amount
                    ),
                    currency_code:
                      selectedVariant.calculated_price.currency_code || "usd",
                  })}
                  /mo
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] leading-5 text-aura-forest/65">
              Every month we charge your card, ship a new box, and buy the
              label. Cancel anytime from your account.
            </p>
          </button>
          <button
            type="button"
            onClick={() => {
              void handleAddToCart("one_time")
            }}
            className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
              purchaseType === "one_time"
                ? "border-aura-gold bg-aura-gold/15"
                : "border-aura-forest/15 bg-white/40"
            }`}
            data-testid="one-time-option"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-aura-forest">
                One-time purchase
              </span>
              {selectedVariant?.calculated_price?.calculated_amount != null && (
                <span className="text-[14px] font-semibold text-aura-forest">
                  {convertToLocale({
                    amount: selectedVariant.calculated_price.calculated_amount,
                    currency_code:
                      selectedVariant.calculated_price.currency_code || "usd",
                  })}
                </span>
              )}
            </div>
          </button>
        </div>

        <Button
          onClick={() => {
            void handleAddToCart()
          }}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className={`w-full h-12 !rounded-full uppercase tracking-[0.12em] ${
            isAdding
              ? "!bg-aura-forest !text-aura-cream !opacity-100"
              : "!bg-aura-gold !text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
          }`}
          data-testid="add-product-button"
        >
          {isAdding
            ? "Adding to cart..."
            : !selectedVariant
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : purchaseType === "subscription"
            ? "Subscribe & save"
            : "Add to cart"}
        </Button>
        {addError && (
          <p className="text-[13px] leading-5 text-red-800" role="alert">
            {addError}
          </p>
        )}
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          purchaseType={purchaseType}
        />
      </div>
    </>
  )
}
