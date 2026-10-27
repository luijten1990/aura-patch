import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const HANDLE = "aura-patch"
const UNIT_PRICE = 49.99

export default async function ensureAuraCore({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: HANDLE },
  })

  if (existing.length) {
    logger.info(`Aura Core already exists (${existing[0].id}).`)
    return
  }

  const { data: profiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const { data: channels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  })
  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })

  const shippingProfile = profiles[0]
  const salesChannel = channels[0]
  const stockLocation = locations[0]

  if (!shippingProfile || !salesChannel || !stockLocation) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Aura Core needs an existing shipping profile, sales channel, and stock location."
    )
  }

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Aura Core",
          handle: HANDLE,
          description:
            "Aura Core is the everyday Aura ritual: 19 ingredients in one daily patch. Peel, apply, go. Wear for up to 12 hours. A 30-day pouch.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Pouch", values: ["30-day pouch"] }],
          variants: [
            {
              title: "30-day pouch",
              sku: "AURA-CORE-30",
              options: { Pouch: "30-day pouch" },
              prices: [{ amount: UNIT_PRICE, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
      ],
    },
  })

  const { data: items } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
    filters: { sku: "AURA-CORE-30" },
  })

  if (items[0]) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: [
          {
            location_id: stockLocation.id,
            stocked_quantity: 1000000,
            inventory_item_id: items[0].id,
          },
        ],
      },
    })
  }

  logger.info("Created Aura Core (aura-patch) at $49.99.")
}
