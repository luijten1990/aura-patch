import { HttpTypes } from "@medusajs/types"

type MoneyCart = {
  currency_code?: string | null
  total?: number | null
  subtotal?: number | null
  item_subtotal?: number | null
  shipping_subtotal?: number | null
  discount_subtotal?: number | null
  tax_total?: number | null
  region?: { currency_code?: string | null } | null
  items?: {
    total?: number | null
    unit_price?: number | null
    quantity?: number
  }[] | null
}

export const cartCurrencyCode = (cart?: MoneyCart | null) =>
  cart?.currency_code || cart?.region?.currency_code || "usd"

export const lineItemAmount = (
  item?: {
    total?: number | null
    unit_price?: number | null
    quantity?: number
  } | null
) => {
  const fallback = (Number(item?.unit_price) || 0) * (item?.quantity || 1)

  if (item?.total != null && item.total > 0) {
    return item.total
  }

  return fallback
}

export const cartItemsAmount = (cart?: MoneyCart | null) =>
  (cart?.items || []).reduce((sum, item) => sum + lineItemAmount(item), 0)

export const cartNeedsTotalsRefresh = (cart?: MoneyCart | null) => {
  const pricedItems = cartItemsAmount(cart)
  const computedTotal = Number(cart?.total) || 0
  const computedItemTotal = (cart?.items || []).reduce(
    (sum, item) => sum + (Number(item.total) || 0),
    0
  )

  return pricedItems > 0 && computedTotal === 0 && computedItemTotal === 0
}

export const withCartMoney = <T extends MoneyCart>(cart: T) => {
  const item_subtotal =
    cart.item_subtotal && cart.item_subtotal > 0
      ? cart.item_subtotal
      : cart.subtotal && cart.subtotal > 0
      ? cart.subtotal
      : cartItemsAmount(cart)
  const total = cart.total && cart.total > 0 ? cart.total : item_subtotal

  return {
    ...cart,
    currency_code: cartCurrencyCode(cart),
    item_subtotal,
    subtotal: cart.subtotal && cart.subtotal > 0 ? cart.subtotal : item_subtotal,
    total,
  } as T & HttpTypes.StoreCart
}
