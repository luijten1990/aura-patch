import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { EasyPostFulfillmentService } from "../../../../modules/easypost/service"
import { EASYPOST_CHECKOUT_OPTION_IDS } from "../../../../modules/easypost/rate-options"

type CartAddress = {
  address_1?: string
  city?: string
  province?: string
  postal_code?: string
  country_code?: string
  first_name?: string
  last_name?: string
  company?: string
  phone?: string
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartId = String((req.body as { cart_id?: string } | undefined)?.cart_id || "")
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

  const shippingAddress = (cart as { shipping_address?: CartAddress }).shipping_address
  const quotes: Record<string, { carrier: string; service: string; label: string }> = {}

  await Promise.all(
    EASYPOST_CHECKOUT_OPTION_IDS.map(async (optionId) => {
      const described = await easypost.describeCheckoutRate(
        { id: optionId },
        { easypost_live: true },
        { shipping_address: shippingAddress } as never
      )
      if (described?.label && described.amount > 0) {
        quotes[optionId] = {
          carrier: described.carrier,
          service: described.service,
          label: described.label,
        }
      }
    })
  )

  res.json({ quotes })
}
