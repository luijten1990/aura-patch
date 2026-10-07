import { HttpTypes } from "@medusajs/types"

type MoneyItem = {
  total?: number | null
  subtotal?: number | null
  original_total?: number | null
  unit_price?: number | null
  quantity?: number
  metadata?: Record<string, unknown> | null
}
type MoneyCart = {
  currency_code?: string | null
  total?: number | null
  subtotal?: number | null
  item_subtotal?: number | null
  item_total?: number | null
  shipping_subtotal?: number | null
  shipping_total?: number | null
  discount_subtotal?: number | null
  tax_total?: number | null
  metadata?: Record<string, unknown> | null
  promotions?: { code?: string | null }[] | null
  region?: { currency_code?: string | null } | null
  items?: MoneyItem[] | null
  shipping_methods?: { amount?: number | null; total?: number | null }[] | null
}

export const cartCurrencyCode = (cart?: MoneyCart | null) =>
  cart?.currency_code || cart?.region?.currency_code || "usd"

// The cart must show Medusa's confirmed amount, including zero-priced items.
// Purchase-type metadata is intent, not proof that a discount was applied.
export const lineItemAmount = (item?: MoneyItem | null, _subscribeCart?: boolean) =>
  item?.total ?? (Number(item?.unit_price) || 0) * (item?.quantity ?? 1)

export const cartItemsAmount = (cart?: MoneyCart | null) =>
  cart?.item_total ?? (cart?.items || []).reduce((sum, item) => sum + lineItemAmount(item), 0)

export const cartNeedsTotalsRefresh = (cart?: MoneyCart | null) =>
  Boolean(cart?.items?.length && cart.total == null)

export const withCartMoney = <T extends MoneyCart>(cart: T) => {
  const originalItems = (cart.items || []).reduce(
    (sum, item) => sum + (item.subtotal ?? (Number(item.unit_price) || 0) * (item.quantity ?? 1)), 0
  )
  const item_subtotal = cart.item_subtotal ?? originalItems
  const shipping = cart.shipping_subtotal ?? cart.shipping_total ??
    (cart.shipping_methods || []).reduce((sum, method) => sum + (method.total ?? method.amount ?? 0), 0)
  const discount = cart.discount_subtotal ?? 0
  const total = cart.total ?? item_subtotal - discount + shipping + (cart.tax_total ?? 0)
  return {
    ...cart, currency_code: cartCurrencyCode(cart), item_subtotal,
    subtotal: cart.subtotal ?? item_subtotal, shipping_subtotal: shipping,
    discount_subtotal: discount, total,
  } as T & HttpTypes.StoreCart
}
