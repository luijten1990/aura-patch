import type { ReactNode } from "react"
import {
  shippingCarrierKind,
  type ShippingCarrierKind,
} from "@lib/util/shipping-carrier"

const markClass =
  "mt-0.5 inline-flex h-7 min-w-[2.75rem] shrink-0 items-center justify-center rounded-md px-1.5"

function UspsMark() {
  return (
    <span
      className={`${markClass} bg-[#333366] text-[9px] font-bold tracking-[0.14em] text-white`}
      aria-hidden="true"
    >
      USPS
    </span>
  )
}

function UpsMark() {
  return (
    <span
      className={`${markClass} bg-[#351C15] text-[10px] font-bold tracking-[0.08em] text-[#FFB500]`}
      aria-hidden="true"
    >
      UPS
    </span>
  )
}

function DhlMark() {
  return (
    <span
      className={`${markClass} bg-[#FFCC00] text-[10px] font-extrabold tracking-[0.12em] text-[#D40511]`}
      aria-hidden="true"
    >
      DHL
    </span>
  )
}

function DhlExpressMark() {
  return (
    <span
      className={`${markClass} bg-[#D40511] text-[10px] font-extrabold tracking-[0.12em] text-white`}
      aria-hidden="true"
    >
      DHL
    </span>
  )
}

function GenericMark() {
  return (
    <span
      className={`${markClass} border border-aura-forest/20 bg-white text-[9px] font-semibold tracking-[0.1em] text-aura-forest/70`}
      aria-hidden="true"
    >
      SHIP
    </span>
  )
}

function FedExMark() {
  return (
    <span
      className={`${markClass} min-w-[3.1rem] bg-white px-1`}
      aria-hidden="true"
    >
      <span className="text-[9px] font-extrabold tracking-tight text-[#4D148C]">
        Fed
      </span>
      <span className="text-[9px] font-extrabold tracking-tight text-[#FF6600]">
        Ex
      </span>
    </span>
  )
}

const MARKS: Record<ShippingCarrierKind, () => ReactNode> = {
  usps: UspsMark,
  ups: UpsMark,
  dhl: DhlMark,
  "dhl-express": DhlExpressMark,
  fedex: FedExMark,
  generic: GenericMark,
}

export default function CarrierMark({
  option,
  quoted,
}: {
  option: { name?: string | null; data?: { id?: string } | Record<string, unknown> | null }
  quoted?: { carrier: string; service?: string; label: string } | null
}) {
  const Mark = MARKS[shippingCarrierKind(option, quoted)]
  return <Mark />
}
