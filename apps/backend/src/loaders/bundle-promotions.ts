import { LoaderOptions } from "@medusajs/framework/types"
import { ensureBundlePromotionsWorkflow } from "../workflows/ensure-bundle-promotions"
import { ensureSubscribePromotionWorkflow } from "../workflows/ensure-subscribe-promotion"

export default async function bundlePromotionsLoader({ container }: LoaderOptions) {
  // Configure rules before serving carts; the scheduled job keeps them in sync.
  await ensureSubscribePromotionWorkflow(container).run()
  await ensureBundlePromotionsWorkflow(container).run()
}
