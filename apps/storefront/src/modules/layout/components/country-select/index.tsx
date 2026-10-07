"use client"

import { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
  dropdownPlacement?: "top" | "bottom"
}

const flagStyle = {
  width: "18px",
  height: "12px",
  display: "block",
  objectFit: "cover" as const,
}

const CountryFlag = ({ code }: { code: string }) => {
  if (!code) {
    return null
  }

  return (
    <span
      className="inline-flex h-3 w-[18px] shrink-0 overflow-hidden rounded-[1px] ring-1 ring-current/30"
      aria-hidden="true"
    >
      <ReactCountryFlag svg countryCode={code} style={flagStyle} />
    </span>
  )
}

const CountrySelect = ({
  toggleState,
  regions,
  dropdownPlacement = "bottom",
}: CountrySelectProps) => {
  const { countryCode } = useParams()
  const pathname = usePathname() || ""
  const country =
    typeof countryCode === "string"
      ? countryCode
      : Array.isArray(countryCode)
        ? countryCode[0]
        : ""
  const currentPath = country
    ? pathname.split(`/${country}`)[1] || ""
    : pathname
  const { state, close } = toggleState

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2 ?? "",
          region: r.id,
          label: c.display_name ?? "",
        }))
      })
      .flat()
      .filter((o): o is CountryOption => !!o)
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  const current = options?.find((o) => o.country === country)

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    close()
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full py-1 text-left"
        data-testid="nav-country-button"
        aria-expanded={state}
        aria-haspopup="listbox"
      >
        <span className="txt-compact-small flex items-center gap-x-2">
          <span>Shipping to:</span>
          {current && (
            <span className="inline-flex items-center gap-x-2">
              <CountryFlag code={current.country} />
              <span>{current.label}</span>
            </span>
          )}
        </span>
      </button>
      {state && (
        <div
          className={
            dropdownPlacement === "top"
              ? "absolute bottom-full right-0 z-[900] max-h-[min(442px,calc(100vh-80px))] w-[320px] overflow-y-auto rounded-rounded bg-white pb-2 text-small-regular uppercase text-black no-scrollbar drop-shadow-md"
              : "absolute top-full right-0 z-[900] max-h-[min(442px,calc(100vh-80px))] w-[320px] overflow-y-auto rounded-rounded bg-white pt-2 text-small-regular uppercase text-black no-scrollbar drop-shadow-md"
          }
        >
          {options?.map((o) => (
            <button
              type="button"
              key={o.country}
              onClick={() => handleChange(o)}
              className="flex w-full cursor-pointer items-center gap-x-2 px-3 py-2 text-left hover:bg-gray-200"
              data-testid={`nav-country-option-${o.country}`}
            >
              <CountryFlag code={o.country} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CountrySelect
