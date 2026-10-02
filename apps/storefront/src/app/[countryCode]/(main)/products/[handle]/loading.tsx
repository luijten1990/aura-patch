export default function ProductLoading() {
  return (
    <div
      className="content-container grid gap-8 py-8 small:grid-cols-[1.1fr_1fr] small:gap-16 small:py-12"
      role="status"
      aria-label="Loading product"
    >
      <div className="aspect-[4/5] max-h-[650px] w-full bg-aura-forest/5" />
      <div className="space-y-7">
        <div className="h-4 w-32 bg-aura-forest/10" />
        <div className="h-14 w-3/4 bg-aura-forest/10" />
        <div className="h-24 w-full bg-aura-forest/5" />
        <div className="h-[350px] w-full bg-aura-forest/5" />
        <span className="sr-only">
          Loading product details and purchase options…
        </span>
      </div>
    </div>
  )
}
