import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { EasyPostFulfillmentService } from "../../../../modules/easypost/service"

type CartAddress = {
  address_1?: string
  address_2?: string
  city?: string
  province?: string
  postal_code?: string
  country_code?: string
  first_name?: string
  last_name?: string
  company?: string
  phone?: string
}

function quoteAddress(value: unknown): CartAddress | null {
  if (!value || typeof value !== "object") {
    return null
  }
  const source = value as Record<string, unknown>
  const address: CartAddress = {
    address_1: text(source.address_1, 120),
    address_2: text(source.address_2, 120),
    city: text(source.city, 80),
    province: text(source.province, 40),
    postal_code: text(source.postal_code, 16),
    country_code: text(source.country_code, 2).toLowerCase(),
    first_name: text(source.first_name, 40),
    last_name: text(source.last_name, 40),
    company: text(source.company, 80),
    phone: text(source.phone, 32),
  }
  if (!address.address_1 || !address.city || !address.postal_code || address.country_code.length !== 2) {
    return null
  }
  return address
}

function text(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max)
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = (req.body || {}) as { cart_id?: string; shipping_address?: unknown }
  const cartId = String(body.cart_id || "")
  if (!cartId) {
    res.status(400).json({ message: "cart_id is required" })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [cart] } = await query.graph({
    entity: "cart",
    fields: [
      "id",
      "shipping_address.address_1",
      "shipping_address.city",
      "shipping_address.province",
      "shipping_address.postal_code",
      "shipping_address.country_code",
      "shipping_address.first_name",
      "shipping_address.last_name",
      "shipping_address.company",
      "shipping_address.phone",
    ],
    filters: { id: cartId },
  })

  if (!cart) {
    res.status(404).json({ message: "Cart not found" })
    return
  }

  let easypost: EasyPostFulfillmentService
  try {
    easypost = req.scope.resolve("fp_easypost_easypost")
  } catch {
    res.status(503).json({ quotes: {} })
    return
  }

  const provided = quoteAddress(body.shipping_address)
  const shippingAddress = provided || (cart as { shipping_address?: CartAddress }).shipping_address
  const quotes = await easypost.describeCheckoutRates(shippingAddress, { easypost_live: true })

  res.json({ quotes })
}
