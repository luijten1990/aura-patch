"use client"

import { Table, Text, clx } from "@modules/common/components/ui"
import { setCartPurchaseTypeRequest, updateLineItemRequest } from "@lib/util/cart-client"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  isSubscription?: boolean
}

const Item = ({ item, type = "full", currencyCode, isSubscription }: ItemProps) => {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [switching, setSwitching] = useState(false)

  const changeQuantity = async (quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1 || quantity === item.quantity) {
      return
    }
    setError(null)
    setUpdating(true)

    await updateLineItemRequest({
      lineId: item.id,
      quantity,
    })
      .then(() => router.refresh())
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory
  const thumbnail =
    item.product_handle === "aura-patch"
      ? "/images/aura-core-front.webp"
      : item.thumbnail

  return (
    <Table.Row
      className="grid w-full grid-cols-[80px_minmax(0,1fr)_auto] gap-x-4 gap-y-3 border-aura-forest/15 py-6 hover:bg-transparent small:table-row"
      data-testid="product-row"
    >
      <Table.Cell className="row-span-2 w-20 !p-0 align-top small:w-28 small:!py-6 small:!pl-0 small:!pr-4">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "w-20 small:w-24": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="!rounded-[1.25rem] !border !border-aura-forest/10 !bg-[#f5efe4] !p-0 !shadow-none"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="min-w-0 !p-0 text-left align-top small:p-4">
        <Text
          className="text-[16px] font-semibold leading-6 text-aura-forest"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <div className="mt-1 text-[12px] text-aura-forest/55">
          {isSubscription || item.metadata?.purchase_type === "subscription" ? (
            <p className="mb-1 text-aura-gold">Subscribe & Save · 20% off · renews monthly</p>
          ) : (
            <p className="mb-1">One-time purchase</p>
          )}
          {type === "full" && (
            <button
              type="button"
              disabled={switching}
              onClick={async () => {
                setSwitching(true)
                try {
                  await setCartPurchaseTypeRequest(isSubscription ? "one_time" : "subscription")
                  router.refresh()
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Unable to update purchase type.")
                } finally {
                  setSwitching(false)
                }
              }}
              className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/70 underline decoration-aura-gold decoration-2 underline-offset-4"
            >
              {switching
                ? "Updating…"
                : isSubscription
                ? "Switch to one-time"
                : "Switch to Subscribe & Save 20%"}
            </button>
          )}
          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant"
          />
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="col-start-2 row-start-2 !p-0 small:table-cell small:p-4">
          <div className="flex w-28 items-center gap-2">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={String(item.quantity)}
              onChange={(event) => {
                const nextQuantity = parseInt(event.target.value, 10)
                void changeQuantity(nextQuantity)
              }}
              className="h-10 w-16 rounded-full border-aura-forest/20 bg-transparent px-3 text-aura-forest"
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                ),
              )}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden text-aura-forest/70 small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="col-start-3 row-start-1 !p-0 text-right text-[15px] font-semibold text-aura-forest small:table-cell small:!py-4 small:!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
