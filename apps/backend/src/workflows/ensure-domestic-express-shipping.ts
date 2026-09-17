import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import {
  createShippingOptionsWorkflow,
  updateShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"

export const DOMESTIC_EXPRESS_NAME = "Express Shipping"
export const DOMESTIC_EXPRESS_AMOUNT = 6.99
export const DOMESTIC_EASYSHIP_OPTION_ID = "easyship-domestic"

type GeoZone = {
  country_code?: string
}

type ShippingOptionRecord = {
  id?: string
  name?: string
  provider_id?: string
  data?: { id?: string }
}

type ServiceZoneRecord = {
  id?: string
  name?: string
  geo_zones?: GeoZone[]
  shipping_options?: ShippingOptionRecord[]
}

type FulfillmentSetRecord = {
  id?: string
  name?: string
  type?: string
  service_zones?: ServiceZoneRecord[]
}

type RegionRecord = {
  id?: string
  currency_code?: string
  countries?: { iso_2?: string }[]
}

type ShippingProfileRecord = {
  id?: string
}

type ProviderRecord = {
  id?: string
}

type EnsureResult = {
  created: boolean
  updated: boolean
  name: string
  service_zone_id: string
}

const isUsOnlyZone = (zone: ServiceZoneRecord) => {
  const countries = (zone.geo_zones || [])
    .map((geoZone) => geoZone.country_code?.toLowerCase())
    .filter(Boolean)

  return countries.length > 0 && countries.every((code) => code === "us")
}

const isExpressOption = (option: ShippingOptionRecord) => {
  const name = option.name?.toLowerCase() || ""
  return name.includes("express") || name.includes("priority")
}

const isEasyshipDomestic = (option: ShippingOptionRecord, providerId: string) =>
  option.provider_id === providerId && option.data?.id === DOMESTIC_EASYSHIP_OPTION_ID

const ensureDomesticExpressShippingStep = createStep(
  "ensure-domestic-express-shipping",
  async (_, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: providers } = await query.graph({
      entity: "fulfillment_provider",
      fields: ["id"],
    })
    const easyshipProviderId = (providers as ProviderRecord[]).find((provider) =>
      provider.id?.includes("easyship")
    )?.id

    if (!easyshipProviderId) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Easyship is not registered. Set EASYSHIP_API_TOKEN and related env vars."
      )
    }

    const { data: fulfillmentSets } = await query.graph({
      entity: "fulfillment_set",
      fields: [
        "id",
        "name",
        "type",
        "service_zones.id",
        "service_zones.name",
        "service_zones.geo_zones.country_code",
        "service_zones.shipping_options.id",
        "service_zones.shipping_options.name",
        "service_zones.shipping_options.provider_id",
        "service_zones.shipping_options.data",
      ],
    })

    const usZone = (fulfillmentSets as FulfillmentSetRecord[])
      .filter((set) => set.type !== "pickup")
      .flatMap((set) => set.service_zones || [])
      .find(isUsOnlyZone)

    if (!usZone?.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "No United States-only service zone was found for Express Shipping."
      )
    }

    const existing = (usZone.shipping_options || []).find(isExpressOption)
    if (existing?.id && isEasyshipDomestic(existing, easyshipProviderId)) {
      return new StepResponse({
        created: false,
        updated: false,
        name: existing.name || DOMESTIC_EXPRESS_NAME,
        service_zone_id: usZone.id,
      } satisfies EnsureResult)
    }

    if (existing?.id) {
      await updateShippingOptionsWorkflow(container).run({
        input: [
          {
            id: existing.id,
            name: DOMESTIC_EXPRESS_NAME,
            provider_id: easyshipProviderId,
            data: { id: DOMESTIC_EASYSHIP_OPTION_ID },
          },
        ],
      })

      return new StepResponse({
        created: false,
        updated: true,
        name: DOMESTIC_EXPRESS_NAME,
        service_zone_id: usZone.id,
      } satisfies EnsureResult)
    }

    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    })
    const shippingProfile = (shippingProfiles as ShippingProfileRecord[])[0]

    if (!shippingProfile?.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "No shipping profile was found for Express Shipping."
      )
    }

    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "currency_code", "countries.iso_2"],
    })
    const usRegion = (regions as RegionRecord[]).find((region) =>
      (region.countries || []).some((country) => country.iso_2?.toLowerCase() === "us")
    )

    const prices: { currency_code?: string; region_id?: string; amount: number }[] = [
      {
        currency_code: "usd",
        amount: DOMESTIC_EXPRESS_AMOUNT,
      },
    ]

    if (usRegion?.id) {
      prices.push({
        region_id: usRegion.id,
        amount: DOMESTIC_EXPRESS_AMOUNT,
      })
    }

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: DOMESTIC_EXPRESS_NAME,
          price_type: "flat",
          provider_id: easyshipProviderId,
          service_zone_id: usZone.id,
          shipping_profile_id: shippingProfile.id,
          data: { id: DOMESTIC_EASYSHIP_OPTION_ID },
          type: {
            label: "Express",
            description: "1-3 business days with tracking via UPS Ground.",
            code: "express",
          },
          prices,
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })

    return new StepResponse({
      created: true,
      updated: false,
      name: DOMESTIC_EXPRESS_NAME,
      service_zone_id: usZone.id,
    } satisfies EnsureResult)
  }
)

export const ensureDomesticExpressShippingWorkflow = createWorkflow(
  "ensure-domestic-express-shipping",
  () => {
    const result = ensureDomesticExpressShippingStep()
    return new WorkflowResponse(result)
  }
)
