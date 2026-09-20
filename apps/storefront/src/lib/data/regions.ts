"use server"

import { cache } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const listRegions = cache(async () => {
  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next: { revalidate: 3600, tags: ["regions"] },
      cache: "force-cache",
    })
    .then(({ regions }) => regions ?? [])
    .catch(() => [] as HttpTypes.StoreRegion[])
})

export const retrieveRegion = cache(async (id: string) => {
  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next: { revalidate: 3600, tags: ["regions"] },
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(() => null)
})

export const getRegion = cache(async (countryCode: string) => {
  try {
    countryCode = countryCode.toLowerCase()

    const regions = await listRegions()

    if (!regions?.length) {
      return null
    }

    const regionMap = new Map<string, HttpTypes.StoreRegion>()
    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region ?? null
  } catch {
    return null
  }
})
