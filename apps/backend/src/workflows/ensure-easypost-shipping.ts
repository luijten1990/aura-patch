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
import {
  EASYPOST_RATE_OPTIONS,
  LEGACY_EASYPOST_OPTION_ID,
  type EasyPostRateOption,
} from "../modules/easypost/rate-options"

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

const isLeftoverShippingOption = (option: ShippingOptionRecord) =>
  isRetiredProvider(option.provider_id)

const isFreeStandardOption = (option: ShippingOptionRecord) =>
  /free standard|standard shipping \(5/.test((option.name || "").toLowerCase())

const CURRENT_OPTION_IDS = new Set(EASYPOST_RATE_OPTIONS.map((option) => option.id))

const isLegacyEasyPostOption = (option: ShippingOptionRecord, providerId: string) =>
  option.provider_id === providerId &&
  (option.data?.id === LEGACY_EASYPOST_OPTION_ID || option.name === "EasyPost Shipping")

const isObsoleteEasyPostOption = (option: ShippingOptionRecord, providerId: string) =>
  option.provider_id === providerId &&
  Boolean(option.data?.id) &&
  !CURRENT_OPTION_IDS.has(String(option.data?.id))

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
      fields: ["id", "name", "provider_id"],
    })
    const retiredIds = (options as ShippingOptionRecord[])
      .filter(isLeftoverShippingOption)
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
        "service_zones.shipping_options.name",
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

    const createCalculatedOption = async (
      zone: ServiceZoneRecord | undefined,
      spec: EasyPostRateOption
    ) => {
      if (!zone?.id || !shippingProfile?.id) {
        return
      }
      const existing = (zone.shipping_options || []).find(
        (option) => option.provider_id === easypostProviderId && option.data?.id === spec.id
      )
      if (existing?.id) {
        if (existing.name !== spec.name) {
          try {
            await fulfillment.updateShippingOptions(existing.id, {
              name: spec.name,
            })
            existing.name = spec.name
          } catch {
            // Name can stay until the next successful catalog update.
          }
        }
        return
      }
      const { result } = await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: spec.name,
            price_type: "calculated",
            provider_id: easypostProviderId,
            service_zone_id: zone.id,
            shipping_profile_id: shippingProfile.id,
            data: { id: spec.id },
            type: {
              label: spec.name,
              description: spec.description,
              code: spec.code,
            },
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
        zone.shipping_options = [...(zone.shipping_options || []), { id: createdId, data: { id: spec.id }, provider_id: easypostProviderId, name: spec.name }]
      }
    }

    const createFreeUsOption = async (zone: ServiceZoneRecord | undefined) => {
      if (!zone?.id || !shippingProfile?.id) {
        return
      }
      if ((zone.shipping_options || []).some(isFreeStandardOption)) {
        return
      }
      const { data: allProviders } = await query.graph({
        entity: "fulfillment_provider",
        fields: ["id"],
      })
      const manualProviderId = (allProviders as ProviderRecord[]).find((provider) =>
        provider.id?.includes("manual")
      )?.id
      if (!manualProviderId) {
        return
      }
      const { result } = await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: "Free Standard Shipping (5–7 business days)",
            price_type: "flat",
            provider_id: manualProviderId,
            service_zone_id: zone.id,
            shipping_profile_id: shippingProfile.id,
            data: { id: "free-standard-us" },
            type: {
              label: "Free Standard",
              description: "Complimentary domestic shipping.",
              code: "free-standard",
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

    for (const spec of EASYPOST_RATE_OPTIONS.filter((option) => option.zone === "us")) {
      await createCalculatedOption(usZone, spec)
    }
    for (const spec of EASYPOST_RATE_OPTIONS.filter((option) => option.zone === "intl")) {
      await createCalculatedOption(existingInternational, spec)
      await createCalculatedOption(extraInternationalZone, spec)
    }
    await createFreeUsOption(usZone)

    for (const zone of [...zones, extraInternationalZone, usZone]) {
      if (!zone?.id) {
        continue
      }
      for (const option of zone.shipping_options || []) {
        if (!option.id || (!isLegacyEasyPostOption(option, easypostProviderId) && !isObsoleteEasyPostOption(option, easypostProviderId))) {
          continue
        }
        try {
          await fulfillment.deleteShippingOptions(option.id)
          removedIds.push(option.id)
        } catch {
          // Option is still referenced by a cart or order.
        }
      }
    }

    const internationalZones = [...zones, extraInternationalZone].filter(
      (zone): zone is ServiceZoneRecord => {
        if (!zone?.id) {
          return false
        }
        return !isUsOnlyZone(zone)
      }
    )
    for (const zone of internationalZones) {
      for (const option of zone.shipping_options || []) {
        if (!option.id || !isFreeStandardOption(option)) {
          continue
        }
        try {
          await fulfillment.deleteShippingOptions(option.id)
          removedIds.push(option.id)
        } catch {
          // Option is still referenced by a cart or order.
        }
      }
    }

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
