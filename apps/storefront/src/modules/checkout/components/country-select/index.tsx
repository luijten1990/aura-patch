import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { HttpTypes } from "@medusajs/types"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion
    regions?: HttpTypes.StoreRegion[] | null
  }
>(({ placeholder = "Country", region, regions, defaultValue, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null)

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const countryOptions = useMemo(() => {
    const sourceRegions = regions?.length ? regions : region ? [region] : []
    const seen = new Set<string>()

    return sourceRegions
      .flatMap((item) => item.countries ?? [])
      .reduce<{ value: string; label: string }[]>((options, country) => {
        const value = country.iso_2 ?? ""
        if (!value || seen.has(value)) {
          return options
        }

        seen.add(value)
        options.push({
          value,
          label: country.display_name ?? value.toUpperCase(),
        })
        return options
      }, [])
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [region, regions])

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...props}
    >
      {countryOptions?.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
