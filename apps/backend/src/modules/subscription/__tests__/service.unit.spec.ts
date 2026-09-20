import SubscriptionModuleService from "../service"
import { SubscriptionInterval } from "../types"

describe("SubscriptionModuleService dates", () => {
  const service = new SubscriptionModuleService({} as never)

  it("schedules the next monthly purchase one period ahead", async () => {
    const lastOrder = new Date("2026-09-20T00:00:00.000Z")
    const next = await service.getNextOrderDate({
      last_order_date: lastOrder,
      expiration_date: null,
      interval: SubscriptionInterval.MONTHLY,
      period: 1,
    })

    expect(next?.toISOString()).toBe("2026-10-20T00:00:00.000Z")
  })
})
