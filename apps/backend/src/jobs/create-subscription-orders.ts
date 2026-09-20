import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SUBSCRIPTION_MODULE } from "../modules/subscription"
import SubscriptionModuleService from "../modules/subscription/service"
import { SubscriptionStatus } from "../modules/subscription/types"
import createSubscriptionOrderWorkflow from "../workflows/create-subscription-order"

export default async function createSubscriptionOrdersJob(
  container: MedusaContainer
) {
  const subscriptionModuleService: SubscriptionModuleService =
    container.resolve(SUBSCRIPTION_MODULE)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  let page = 0
  const limit = 20
  let pagesCount = 0
  const lookaheadHours = Number(process.env.SUBSCRIPTION_RENEWAL_LOOKAHEAD_HOURS || 0)
  const now = new Date(Date.now() + Math.max(0, lookaheadHours) * 60 * 60 * 1000)

  do {
    const [subscriptions, count] = await subscriptionModuleService
      .listAndCountSubscriptions({
        next_order_date: {
          $lte: now,
        },
        status: SubscriptionStatus.ACTIVE,
      }, {
        skip: page * limit,
        take: limit,
      })

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          const { result } = await createSubscriptionOrderWorkflow(container).run({
            input: {
              subscription,
            },
          })

          logger.info(
            `Created new order ${result.order.id} for subscription ${subscription.id}`
          )
        } catch (error) {
          logger.error(
            `Error creating a new order for subscription ${subscription.id}: ${String(error)}`
          )
        }
      })
    )

    if (!pagesCount) {
      pagesCount = Math.ceil(count / limit)
    }

    page++
  } while (page < pagesCount)
}

export const config = {
  name: "create-subscription-orders",
  schedule: "0 0 * * *",
}
