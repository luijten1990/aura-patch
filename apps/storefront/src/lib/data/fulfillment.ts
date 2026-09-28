"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
        },
        headers,
        cache: "no-store",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        cache: "no-store",
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch(() => {
      return {
        id: optionId,
        amount: null,
      } as HttpTypes.StoreCartShippingOption
    })
}

export const listCheckoutCarrierQuotes = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{
      quotes: Record<string, { carrier: string; service: string; label: string }>
    }>("/store/easypost/checkout-quotes", {
      method: "POST",
      body: { cart_id: cartId },
      headers,
      cache: "no-store",
    })
    .then((result) => result.quotes || {})
    .catch(() => {
      return {} as Record<string, { carrier: string; service: string; label: string }>
    })
}
