import Spinner from "@modules/common/icons/spinner"

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center text-aura-forest">
      <Spinner size={36} />
    </div>
  )
}
