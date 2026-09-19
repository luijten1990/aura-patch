import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"

const OPTION_ID = "easypost"
const OPTION_NAME = "EasyPost Shipping"

type GeoZone = { country_code?: string }
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
  type?: string
  service_zones?: ServiceZoneRecord[]
}
type RegionRecord = { id?: string; countries?: { iso_2?: string }[] }
type StockLocationRecord = { id?: string }
type ProviderRecord = { id?: string }
type ShippingProfileRecord = { id?: string }

export type EnsureEasyPostResult = {
  removed_ids: string[]
  created_option_ids: string[]
  linked_locations: number
}

const isRetiredProvider = (providerId?: string) =>
  Boolean(providerId?.includes("usps") || providerId?.includes("easyship"))

const isEasyPostOption = (option: ShippingOptionRecord, providerId: string) =>
  option.provider_id === providerId && option.data?.id === OPTION_ID

const isUsOnlyZone = (zone: ServiceZoneRecord) => {
  const countries = (zone.geo_zones || [])
    .map((geoZone) => geoZone.country_code?.toLowerCase())
    .filter(Boolean)
  return countries.length > 0 && countries.every((code) => code === "us")
}

const ensureEasyPostShippingStep = createStep(
  "ensure-easypost-shipping",
  async (_, { container }): Promise<StepResponse<EnsureEasyPostResult>> => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fulfillment = container.resolve(Modules.FULFILLMENT)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    const { data: providers } = await query.graph({
      entity: "fulfillment_provider",
      fields: ["id"],
    })
    const easypostProviderId = (providers as ProviderRecord[]).find((provider) =>
      provider.id?.includes("easypost")
    )?.id

    if (!easypostProviderId) {
      return new StepResponse<EnsureEasyPostResult>({
        removed_ids: [],
        created_option_ids: [],
        linked_locations: 0,
      })
    }

    const { data: locations } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
    })
    let linkedLocations = 0
    for (const location of locations as StockLocationRecord[]) {
      if (!location.id) {
        continue
      }
      try {
        await link.create({
          [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
          [Modules.FULFILLMENT]: { fulfillment_provider_id: easypostProviderId },
        })
        linkedLocations += 1
      } catch {
        // Already linked.
      }
    }

    const { data: options } = await query.graph({
      entity: "shipping_option",
      fields: ["id", "provider_id"],
    })
    const retiredIds = (options as ShippingOptionRecord[])
      .filter((option) => isRetiredProvider(option.provider_id))
      .map((option) => option.id)
      .filter((id): id is string => Boolean(id))
    const removedIds: string[] = []
    for (const id of retiredIds) {
      try {
        await fulfillment.deleteShippingOptions(id)
        removedIds.push(id)
      } catch {
        // Option is still referenced by a cart or order.
      }
    }

    const { data: fulfillmentSets } = await query.graph({
      entity: "fulfillment_set",
      fields: [
        "id",
        "type",
        "service_zones.id",
        "service_zones.name",
        "service_zones.geo_zones.country_code",
        "service_zones.shipping_options.id",
        "service_zones.shipping_options.provider_id",
        "service_zones.shipping_options.data",
      ],
    })
    const shippingSets = (fulfillmentSets as FulfillmentSetRecord[]).filter(
      (set) => set.type !== "pickup"
    )
    const zones = shippingSets.flatMap((set) => set.service_zones || [])
    let usZone = zones.find(isUsOnlyZone)
    const targetSet = shippingSets[0]

    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "countries.iso_2"],
    })
    const countries = [...new Set(
      (regions as RegionRecord[]).flatMap((region) =>
        (region.countries || []).map((country) => country.iso_2?.toLowerCase()).filter(Boolean)
      )
    )] as string[]
    const internationalCountries = countries.filter((code) => code !== "us")
    if (!internationalCountries.includes("nl")) {
      internationalCountries.push("nl")
    }

    if (!usZone?.id && targetSet?.id) {
      const { result: createdZones } = await createServiceZonesWorkflow(container).run({
        input: {
          data: [
            {
              name: "United States",
              fulfillment_set_id: targetSet.id,
              geo_zones: [{ type: "country" as const, country_code: "us" }],
            },
          ],
        },
      })
      usZone = { id: createdZones[0]?.id, name: "United States", shipping_options: [] }
    }

    const existingInternational = zones.find((zone) => !isUsOnlyZone(zone) && zone.id)
    let extraInternationalZone: ServiceZoneRecord | undefined
    const used = new Set(
      zones.flatMap((zone) =>
        (zone.geo_zones || []).map((geoZone) => geoZone.country_code?.toLowerCase())
      )
    )
    const available = internationalCountries.filter((code) => !used.has(code))
    if (targetSet?.id && available.length) {
      const { result: createdZones } = await createServiceZonesWorkflow(container).run({
        input: {
          data: [
            {
              name: "International",
              fulfillment_set_id: targetSet.id,
              geo_zones: available.map((country_code) => ({
                type: "country" as const,
                country_code,
              })),
            },
          ],
        },
      })
      extraInternationalZone = {
        id: createdZones[0]?.id,
        name: "International",
        shipping_options: [],
      }
    }

    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    })
    const shippingProfile = (shippingProfiles as ShippingProfileRecord[])[0]
    const createdOptionIds: string[] = []

    const createOption = async (zone: ServiceZoneRecord | undefined, code: string, description: string) => {
      if (!zone?.id || !shippingProfile?.id) {
        return
      }
      if ((zone.shipping_options || []).some((option) => isEasyPostOption(option, easypostProviderId))) {
        return
      }
      const { result } = await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: OPTION_NAME,
            price_type: "calculated",
            provider_id: easypostProviderId,
            service_zone_id: zone.id,
            shipping_profile_id: shippingProfile.id,
            data: { id: OPTION_ID },
            type: {
              label: "EasyPost",
              description,
              code,
            },
            prices: [{ currency_code: "usd", amount: 0 }],
            rules: [
              { attribute: "enabled_in_store", value: "true", operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
        ],
      })
      const createdId = Array.isArray(result) ? result[0]?.id : undefined
      if (createdId) {
        createdOptionIds.push(createdId)
      }
    }

    await createOption(usZone, "easypost-us", "Live EasyPost rate for United States addresses.")
    await createOption(
      existingInternational,
      "easypost-intl",
      "Live EasyPost rate for international addresses."
    )
    await createOption(
      extraInternationalZone,
      "easypost-intl",
      "Live EasyPost rate for international addresses."
    )

    return new StepResponse<EnsureEasyPostResult>({
      removed_ids: removedIds,
      created_option_ids: createdOptionIds,
      linked_locations: linkedLocations,
    })
  }
)

export const ensureEasyPostShippingWorkflow = createWorkflow(
  "ensure-easypost-shipping",
  () => {
    const result = ensureEasyPostShippingStep()
    return new WorkflowResponse(result)
  }
)
