import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getFinancesOverviewWorkflow } from "../../../workflows/get-finances-overview"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getFinancesOverviewWorkflow(req.scope).run()
  res.json(result)
}
