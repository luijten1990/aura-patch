import { FULL_POUCH_PRICE_USD, subscribeUnitPrice } from "./constants"

export const RENEWAL_SNAPSHOT_KEY = "renewal"

export type SubscriptionRenewalItem = {
  title?: string
  subtitle?: string
  thumbnail?: string
  variant_id?: string
  product_id?: string
  quantity: number
  unit_price: number
  metadata?: Record<string, unknown>
}

export type SubscriptionRenewalShippingMethod = {
  name: string
  amount: number
  is_tax_inclusive?: boolean
  shipping_option_id?: string
  data?: Record<string, unknown>
}

export type SubscriptionRenewalSnapshot = {
  customer_id?: string
  email?: string
  currency_code: string
  region_id?: string
  sales_channel_id?: string
  amount: number
  shipping_address?: Record<string, unknown>
  billing_address?: Record<string, unknown>
  items: SubscriptionRenewalItem[]
  shipping_methods: SubscriptionRenewalShippingMethod[]
}

export const RENEWAL_ORDER_FIELDS = [
  "id",
  "customer_id",
  "email",
  "currency_code",
  "region_id",
  "sales_channel_id",
  "total",
  "shipping_address.*",
  "billing_address.*",
  "items.title",
  "items.subtitle",
  "items.thumbnail",
  "items.variant_id",
  "items.product_id",
  "items.quantity",
  "items.unit_price",
  "items.raw_unit_price",
  "items.metadata",
  "shipping_methods.name",
  "shipping_methods.amount",
  "shipping_methods.raw_amount",
  "shipping_methods.is_tax_inclusive",
  "shipping_methods.shipping_option_id",
  "shipping_methods.data",
]

const asRecord = (value: unknown) =>
  value && typeof value === "object" ? value as Record<string, unknown> : undefined

const asString = (value: unknown) =>
  typeof value === "string" && value ? value : undefined

const asFinite = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return undefined
}

// Medusa query results hand back BigNumber instances or { value, precision }
// objects. Reading them as plain numbers stores 0 and a later renewal would
// try to charge nothing.
const asNumber = (value: unknown): number => {
  const direct = asFinite(value)
  if (direct !== undefined) {
    return direct
  }
  if (!value || typeof value !== "object") {
    return 0
  }

  const record = value as Record<string, unknown>
  const numeric = asFinite(record.numeric) ?? asFinite(record.numeric_)
  if (numeric !== undefined) {
    return numeric
  }

  const raw = asRecord(record.raw) || asRecord(record.raw_)
  const rawValue = raw ? asFinite(raw.value) : undefined
  if (rawValue !== undefined) {
    return rawValue
  }

  const plainValue = asFinite(record.value)
  if (plainValue !== undefined) {
    return plainValue
  }

  if (
    typeof record.valueOf === "function" &&
    record.valueOf !== Object.prototype.valueOf
  ) {
    const primitive = asFinite(record.valueOf())
    if (primitive !== undefined) {
      return primitive
    }
  }

  return 0
}

const firstMoney = (...values: unknown[]) => {
  for (const value of values) {
    if (value === undefined || value === null || value === "") {
      continue
    }
    const parsed = asNumber(value)
    if (parsed !== 0) {
      return parsed
    }
  }
  return 0
}

const sanitizeAddress = (value: unknown) => {
  const address = asRecord(value)
  if (!address) {
    return undefined
  }

  const {
    id: _id,
    created_at: _createdAt,
    updated_at: _updatedAt,
    ...rest
  } = address

  return {
    ...rest,
    id: null,
  }
}

export const buildRenewalSnapshot = (
  order: Record<string, unknown>
): SubscriptionRenewalSnapshot => {
  const items = (Array.isArray(order.items) ? order.items : [])
    .map((item) => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map((item) => {
      const quantity = asNumber(item.quantity) || asNumber(item.raw_quantity) || 1
      const listUnit = firstMoney(item.unit_price, item.raw_unit_price)
      const metadata = asRecord(item.metadata)
      const isSubscription = metadata?.purchase_type === "subscription"
      const unitPrice =
        isSubscription && Math.abs(listUnit - FULL_POUCH_PRICE_USD) < 0.001
          ? subscribeUnitPrice(listUnit)
          : listUnit

      return {
        title: asString(item.title),
        subtitle: asString(item.subtitle),
        thumbnail: asString(item.thumbnail),
        variant_id: asString(item.variant_id),
        product_id: asString(item.product_id),
        quantity,
        unit_price: unitPrice,
        metadata,
      }
    })

  const shippingMethods = (Array.isArray(order.shipping_methods) ? order.shipping_methods : [])
    .map((method) => asRecord(method))
    .filter((method): method is Record<string, unknown> => Boolean(method))
    .map((method) => ({
      name: asString(method.name) || "Shipping",
      amount: firstMoney(method.amount, method.raw_amount),
      is_tax_inclusive: Boolean(method.is_tax_inclusive),
      shipping_option_id: asString(method.shipping_option_id),
      data: asRecord(method.data),
    }))

  const itemTotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  )
  const shippingTotal = shippingMethods.reduce(
    (sum, method) => sum + method.amount,
    0
  )
  const subscribeTotal = Math.round((itemTotal + shippingTotal) * 100) / 100
  const recordedTotal = firstMoney(order.total, order.raw_total)

  return {
    customer_id: asString(order.customer_id),
    email: asString(order.email),
    currency_code: asString(order.currency_code) || "usd",
    region_id: asString(order.region_id),
    sales_channel_id: asString(order.sales_channel_id),
    amount: recordedTotal > 0 ? Math.min(recordedTotal, subscribeTotal) : subscribeTotal,
    shipping_address: sanitizeAddress(order.shipping_address),
    billing_address: sanitizeAddress(order.billing_address),
    items,
    shipping_methods: shippingMethods,
  }
}

export const readRenewalSnapshot = (
  metadata: Record<string, unknown> | null | undefined
): SubscriptionRenewalSnapshot | null => {
  const snapshot = metadata?.[RENEWAL_SNAPSHOT_KEY]
  if (!snapshot || typeof snapshot !== "object") {
    return null
  }

  const record = snapshot as SubscriptionRenewalSnapshot
  if (!Array.isArray(record.items) || !record.items.length) {
    return null
  }

  return record
}

export const renewalSnapshotMissingPrices = (
  snapshot: SubscriptionRenewalSnapshot
) => {
  const hasItemPrice = snapshot.items.some((item) => item.unit_price > 0)
  return snapshot.amount <= 0 || !hasItemPrice
}
