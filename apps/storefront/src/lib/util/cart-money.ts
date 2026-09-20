import { HttpTypes } from "@medusajs/types"
import {
  isSubscriptionCart,
  SUBSCRIBE_CODE,
  subscriptionAmount,
} from "@lib/util/subscription"

type MoneyItem = {
  total?: number | null
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
  shipping_subtotal?: number | null
  shipping_total?: number | null
  discount_subtotal?: number | null
  tax_total?: number | null
  metadata?: Record<string, unknown> | null
  promotions?: { code?: string | null }[] | null
  region?: { currency_code?: string | null } | null
  items?: MoneyItem[] | null
  shipping_methods?: {
    amount?: number | null
    total?: number | null
  }[] | null
}

export const cartCurrencyCode = (cart?: MoneyCart | null) =>
  cart?.currency_code || cart?.region?.currency_code || "usd"

export const lineItemAmount = (
  item?: MoneyItem | null,
  subscribeCart?: boolean
) => {
  const original = (Number(item?.unit_price) || 0) * (item?.quantity || 1)
  const apiTotal =
    item?.total != null && item.total > 0 ? item.total : original
  const itemIsSubscribe =
    subscribeCart || item?.metadata?.purchase_type === "subscription"

  if (itemIsSubscribe && original > 0) {
    return Math.min(apiTotal, subscriptionAmount(original))
  }

  return apiTotal || original
}

export const cartItemsAmount = (cart?: MoneyCart | null) =>
  (cart?.items || []).reduce(
    (sum, item) => sum + lineItemAmount(item, isSubscriptionCart(cart)),
    0
  )

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
  const subscribe = isSubscriptionCart(cart)
  const hasSubscribePromo = Boolean(
    cart.promotions?.some((promotion) => promotion.code === SUBSCRIBE_CODE)
  )
  const itemsAmount = cartItemsAmount(cart)
  const originalItems = (cart.items || []).reduce(
    (sum, item) =>
      sum + (Number(item.unit_price) || 0) * (item.quantity || 1),
    0
  )
  const item_subtotal =
    subscribe || hasSubscribePromo
      ? itemsAmount
      : cart.item_subtotal && cart.item_subtotal > 0
      ? cart.item_subtotal
      : cart.subtotal && cart.subtotal > 0
      ? cart.subtotal
      : itemsAmount
  const discount_subtotal = Math.max(
    Number(cart.discount_subtotal) || 0,
    originalItems - item_subtotal
  )
  const shippingFromMethods = (cart.shipping_methods || []).reduce(
    (sum, method) =>
      sum + (Number(method.total) || Number(method.amount) || 0),
    0
  )
  const shipping =
    Number(cart.shipping_subtotal) ||
    Number(cart.shipping_total) ||
    shippingFromMethods
  const tax = Number(cart.tax_total) || 0
  const total =
    subscribe || hasSubscribePromo
      ? item_subtotal + shipping + tax
      : cart.total && cart.total > 0
      ? Math.max(cart.total, item_subtotal + shipping + tax)
      : item_subtotal + shipping + tax

  return {
    ...cart,
    currency_code: cartCurrencyCode(cart),
    item_subtotal,
    subtotal: item_subtotal,
    shipping_subtotal: shipping,
    discount_subtotal,
    total,
  } as T & HttpTypes.StoreCart
}
