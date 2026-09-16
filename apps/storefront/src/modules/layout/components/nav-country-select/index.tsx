"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "@modules/layout/components/country-select"

const NavCountrySelect = ({
  regions,
}: {
  regions: HttpTypes.StoreRegion[] | null
}) => {
  const toggleState = useToggleState()

  if (!regions?.length) {
    return null
  }

  return (
    <div
      className="hidden small:flex items-center"
      onMouseEnter={toggleState.open}
      onMouseLeave={toggleState.close}
    >
      <CountrySelect toggleState={toggleState} regions={regions} />
    </div>
  )
}

export default NavCountrySelect
