import { MedusaService } from "@medusajs/framework/utils"
import Subscription from "./models/subscription"
import {
  CreateSubscriptionData,
  SubscriptionData,
  SubscriptionInterval,
  SubscriptionStatus,
} from "./types"

class SubscriptionModuleService extends MedusaService({
  Subscription,
}) {
  async getNextOrderDate({
    last_order_date,
    expiration_date,
    interval,
    period,
  }: {
    last_order_date: Date
    expiration_date?: Date | null
    interval: SubscriptionInterval
    period: number
  }): Promise<Date | null> {
    const nextOrderDate = new Date(last_order_date)
    if (interval === SubscriptionInterval.MONTHLY) {
      nextOrderDate.setMonth(nextOrderDate.getMonth() + period)
    } else {
      nextOrderDate.setFullYear(nextOrderDate.getFullYear() + period)
    }

    if (expiration_date && nextOrderDate > new Date(expiration_date)) {
      return null
    }

    return nextOrderDate
  }

  async createSubscriptionWithDates(
    data: CreateSubscriptionData
  ): Promise<SubscriptionData> {
    const subscriptionDate = data.subscription_date || new Date()
    const created = await this.createSubscriptions({
      status: data.status || SubscriptionStatus.ACTIVE,
      interval: data.interval,
      period: data.period,
      subscription_date: subscriptionDate,
      last_order_date: subscriptionDate,
      expiration_date: null,
      next_order_date: await this.getNextOrderDate({
        last_order_date: subscriptionDate,
        expiration_date: null,
        interval: data.interval,
        period: data.period,
      }),
      metadata: data.metadata ?? null,
    })

    return Array.isArray(created) ? created[0] : created
  }

  async recordNewSubscriptionOrder(id: string) {
    const subscription = await this.retrieveSubscription(id)
    const orderDate = new Date()

    return await this.updateSubscriptions({
      id,
      last_order_date: orderDate,
      next_order_date: await this.getNextOrderDate({
        last_order_date: orderDate,
        expiration_date: subscription.expiration_date,
        interval: subscription.interval,
        period: subscription.period,
      }),
    })
  }

  async cancelSubscriptions(
    id: string | string[]
  ): Promise<SubscriptionData[]> {
    const input = Array.isArray(id) ? id : [id]

    return await this.updateSubscriptions({
      selector: {
        id: input,
      },
      data: {
        next_order_date: null,
        status: SubscriptionStatus.CANCELED,
      },
    })
  }
}

export default SubscriptionModuleService
