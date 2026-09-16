import SkeletonOrderConfirmedHeader from "@modules/skeletons/components/skeleton-order-confirmed-header"
import SkeletonOrderInformation from "@modules/skeletons/components/skeleton-order-information"
import SkeletonOrderItems from "@modules/skeletons/components/skeleton-order-items"

const SkeletonOrderConfirmed = () => {
  return (
    <div className="min-h-[70vh] animate-pulse bg-aura-cream py-12 small:py-20">
      <div className="content-container max-w-[920px]">
        <div className="h-3 w-28 rounded-full bg-aura-forest/10" />
        <div className="mt-5 h-12 w-64 rounded-full bg-aura-forest/10 small:h-16" />
        <div className="mt-12 grid grid-cols-1 gap-6 small:grid-cols-2">
          <div className="rounded-[1.75rem] border border-aura-forest/10 bg-[#f5efe4] p-6">
            <SkeletonOrderConfirmedHeader />
            <SkeletonOrderItems />
          </div>
          <div className="rounded-[1.75rem] border border-aura-forest/10 bg-[#f5efe4] p-6">
            <SkeletonOrderInformation />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonOrderConfirmed
