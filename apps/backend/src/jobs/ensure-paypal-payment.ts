import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

const PAYPAL_PROVIDER_ID = "pp_paypal_paypal"

export default async function ensurePaypalPaymentProviderJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "payment_providers.id"],
  })

  for (const region of regions as {
    id: string
    payment_providers?: { id: string }[]
  }[]) {
    const providerIds = (region.payment_providers || []).map(
      (provider) => provider.id
    )

    if (providerIds.includes(PAYPAL_PROVIDER_ID)) {
      continue
    }

    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: region.id },
        update: {
          payment_providers: [...providerIds, PAYPAL_PROVIDER_ID],
        },
      },
    })

    logger.info(`Enabled PayPal on region ${region.id}`)
  }
}

export const config = {
  name: "ensure-paypal-payment-provider",
  schedule: "* * * * *",
  numberOfExecutions: 12,
}
