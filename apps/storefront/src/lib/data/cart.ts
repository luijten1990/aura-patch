"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect, unstable_rethrow } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { getLocale } from "./locale-actions"
import {
  isSubscriptionCart,
  SUBSCRIBE_CODE,
  SUBSCRIPTION_INTERVAL,
  SUBSCRIPTION_PERIOD,
  type PurchaseType,
} from "@lib/util/subscription"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
const CART_FIELDS =
  "metadata, email, currency_code, *items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, +items.subtotal, +items.original_total, *promotions, *shipping_address, *billing_address, *shipping_methods, +shipping_methods.name, +shipping_methods.amount, +shipping_methods.total, *payment_collection, *payment_collection.payment_sessions, +total, +subtotal, +item_subtotal, +shipping_subtotal, +shipping_total, +discount_subtotal, +tax_total"

const revalidateByTag = async (tag: string) => {
  const cacheTag = await getCacheTag(tag)
  if (!cacheTag) {
    return
  }
  revalidateTag(cacheTag)
}

export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId())
  fields ??= CART_FIELDS

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  const loadCart = () =>
    sdk.client
      .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
        method: "GET",
        query: {
          fields,
        },
        headers,
        next,
        cache: "no-store",
      })
      .then(({ cart }: { cart: HttpTypes.StoreCart }) => cart)
      .catch(() => null)

  return loadCart()
}

const ADD_TO_CART_FIELDS =
  "id,region_id,metadata,*items.id,*items.variant_id,*items.quantity,*items.metadata,*promotions"

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart(undefined, ADD_TO_CART_FIELDS)

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const locale = await getLocale()
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id, locale: locale || undefined },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)
    await revalidateByTag("carts")
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    await revalidateByTag("carts")
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      await revalidateByTag("carts")
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
  purchaseType = "subscription",
}: {
  variantId: string
  quantity: number
  countryCode: string
  purchaseType?: PurchaseType
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }
  const cartId = await getCartId()

  if (cartId) {
    try {
      await sdk.store.cart.createLineItem(
        cartId,
        {
          variant_id: variantId,
          quantity,
          metadata: {
            purchase_type: purchaseType,
          },
        },
        {},
        headers
      )
      await revalidateByTag("carts")
      return
    } catch {
      // Cart may be missing, or this variant is already in the cart.
    }
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const existing = (cart.items || []).find(
    (item) => item.variant_id === variantId || item.variant?.id === variantId
  )

  try {
    if (existing?.id) {
      await sdk.store.cart.updateLineItem(
        cart.id,
        existing.id,
        {
          quantity,
          metadata: {
            ...(existing.metadata || {}),
            purchase_type: purchaseType,
          },
        },
        {},
        headers
      )
    } else {
      await sdk.store.cart.createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
          metadata: {
            purchase_type: purchaseType,
          },
        },
        {},
        headers
      )
    }
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not add Aura Patch to the cart. Please try again."
    throw new Error(message)
  }

  await revalidateByTag("carts")
}

function purchaseTypePayload(
  cart: HttpTypes.StoreCart,
  purchaseType: PurchaseType
) {
  const subscribe = purchaseType === "subscription"
  const existingCodes = (cart.promotions || [])
    .map((promotion) => promotion.code)
    .filter((code): code is string => Boolean(code))
    .filter((code) => code !== SUBSCRIBE_CODE)

  return {
    subscribe,
    metadata: {
      ...(cart.metadata || {}),
      subscription_interval: subscribe ? SUBSCRIPTION_INTERVAL : "",
      subscription_period: subscribe ? SUBSCRIPTION_PERIOD : 0,
    },
    promo_codes: subscribe
      ? [...existingCodes.filter((code) => code !== "ILOVEAURA"), SUBSCRIBE_CODE]
      : existingCodes,
    hasPromo: Boolean(
      (cart.promotions || []).some((promotion) => promotion.code === SUBSCRIBE_CODE)
    ),
  }
}

async function syncCartPurchaseType(purchaseType: PurchaseType) {
  const cart = await retrieveCart()
  if (!cart) {
    return
  }

  const { subscribe, metadata, promo_codes, hasPromo } = purchaseTypePayload(
    cart,
    purchaseType
  )
  const metaMatches =
    Boolean(cart.metadata?.subscription_interval) === subscribe &&
    (!subscribe || Number(cart.metadata?.subscription_period) > 0)
  const promoMatches = subscribe ? hasPromo : !hasPromo
  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!metaMatches || !promoMatches) {
    try {
      await sdk.store.cart.update(
        cart.id,
        { metadata, promo_codes },
        {},
        headers
      )
    } catch {
      // Line-item purchase_type is enough for Subscribe & Save checkout.
    }
  }

  await Promise.all(
    (cart.items || [])
      .filter(
        (item) =>
          item.id && item.metadata?.purchase_type !== purchaseType
      )
      .map((item) =>
        sdk.store.cart
          .updateLineItem(
            cart.id,
            item.id,
            {
              quantity: item.quantity,
              metadata: {
                ...(item.metadata || {}),
                purchase_type: purchaseType,
              },
            },
            {},
            headers
          )
          .catch(() => undefined)
      )
  )

  await revalidateByTag("carts")
}

export async function ensureCheckoutPurchaseType(cart: HttpTypes.StoreCart) {
  const purchaseType: PurchaseType = isSubscriptionCart(cart)
    ? "subscription"
    : "one_time"
  const { subscribe, hasPromo } = purchaseTypePayload(cart, purchaseType)
  const metaReady =
    !subscribe ||
    (cart.metadata?.subscription_interval === SUBSCRIPTION_INTERVAL &&
      Number(cart.metadata?.subscription_period) > 0)

  if (metaReady && (subscribe ? hasPromo : !hasPromo)) {
    return cart
  }

  await syncCartPurchaseType(purchaseType)
  return (await retrieveCart(cart.id)) || cart
}

export async function setCartPurchaseType(purchaseType: PurchaseType) {
  await syncCartPurchaseType(purchaseType)
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.store.cart.updateLineItem(cartId, lineId, { quantity }, {}, headers)
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not update the quantity. Please try again."
    throw new Error(message)
  }

  try {
    await revalidateByTag("carts")
    await revalidateByTag("fulfillment")
  } catch {
    // Quantity is already saved.
  }
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.store.cart.deleteLineItem(cartId, lineId, {}, headers)
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not remove that item. Please try again."
    throw new Error(message)
  }

  try {
    await revalidateByTag("carts")
    await revalidateByTag("fulfillment")
  } catch {
    // Item is already removed.
  }
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.store.cart.addShippingMethod(
      cartId,
      { option_id: shippingMethodId },
      {},
      headers
    )
  } catch (error) {
    return {
      ok: false as const,
      error: shippingMethodError(error),
    }
  }

  try {
    await revalidateByTag("carts")
  } catch {
    // Shipping is already saved; skip empty-tag / cache errors so checkout can continue.
  }

  return { ok: true as const }
}

function shippingMethodError(error: unknown): string {
  const err = error as {
    message?: string
    response?: { data?: { message?: string } | string }
  }
  const data = err.response?.data
  if (typeof data === "object" && data?.message) {
    return data.message
  }
  if (typeof data === "string" && data.trim()) {
    return data
  }
  if (err.message && err.message !== "An unknown error occurred") {
    return err.message
  }
  return "Unable to save that shipping option. Please try again."
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const payload = isSubscriptionCart(cart)
    ? {
        ...data,
        data: {
          ...(data.data || {}),
          setup_future_usage: "off_session",
        },
      }
    : data

  return sdk.store.payment
    .initiatePaymentSession(cart, payload, {}, headers)
    .then(async (resp) => {
      await revalidateByTag("carts")
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      await revalidateByTag("carts")
      await revalidateByTag("fulfillment")
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

const formString = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

export async function saveCheckoutAddresses(formData: FormData) {
  if (!formData) {
    throw new Error("No form data found when setting addresses")
  }
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found when setting addresses")
  }

  const countryCode = formString(formData, "shipping_address.country_code").toLowerCase()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(
      "Shipping is not available to the selected country. Add that country to a Medusa region first."
    )
  }

  const shippingAddress = {
    first_name: formString(formData, "shipping_address.first_name"),
    last_name: formString(formData, "shipping_address.last_name"),
    address_1: formString(formData, "shipping_address.address_1"),
    address_2: "",
    company: formString(formData, "shipping_address.company"),
    postal_code: formString(formData, "shipping_address.postal_code"),
    city: formString(formData, "shipping_address.city"),
    country_code: countryCode,
    province: formString(formData, "shipping_address.province"),
    phone: formString(formData, "shipping_address.phone"),
  }

  const data: HttpTypes.StoreUpdateCart & { email?: string } = {
    region_id: region.id,
    shipping_address: shippingAddress,
    email: formString(formData, "email"),
  }

  const sameAsBilling = formString(formData, "same_as_billing")
  if (sameAsBilling === "on") {
    data.billing_address = shippingAddress
  } else {
    data.billing_address = {
      first_name: formString(formData, "billing_address.first_name"),
      last_name: formString(formData, "billing_address.last_name"),
      address_1: formString(formData, "billing_address.address_1"),
      address_2: "",
      company: formString(formData, "billing_address.company"),
      postal_code: formString(formData, "billing_address.postal_code"),
      city: formString(formData, "billing_address.city"),
      country_code: formString(formData, "billing_address.country_code").toLowerCase(),
      province: formString(formData, "billing_address.province"),
      phone: formString(formData, "billing_address.phone"),
    }
  }

  await updateCart(data)
  return countryCode
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    const countryCode = await saveCheckoutAddresses(formData)
    const checkoutCountry =
      String(formData.get("checkout_country") || countryCode).toLowerCase() ||
      countryCode
    redirect(`/${checkoutCountry}/checkout?step=delivery`)
  } catch (e: any) {
    unstable_rethrow(e)
    return e.message
  }
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cart = await retrieveCart(id)
  const completePath = isSubscriptionCart(cart)
    ? `/store/carts/${id}/subscribe`
    : null

  const cartRes = (
    completePath
      ? sdk.client.fetch<{
          type: "cart"
          cart: HttpTypes.StoreCart
        } | {
          type: "order"
          order: HttpTypes.StoreOrder
        }>(completePath, {
          method: "POST",
          headers,
        })
      : sdk.store.cart.complete(id, {}, headers)
  )
    .then(async (response) => {
      await revalidateByTag("carts")
      return response
    })
    .catch(medusaError)

  const result = await cartRes

  if (result?.type === "order") {
    const countryCode =
      result.order.shipping_address?.country_code?.toLowerCase()

    await revalidateByTag("orders")

    removeCartId()
    redirect(`/${countryCode}/order/${result.order.id}/confirmed`)
  }

  return result.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    await revalidateByTag("carts")
  }

  await revalidateByTag("regions")
  await revalidateByTag("products")

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    headers,
    cache: "no-store",
  })
}
