import { Container } from "@modules/common/components/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="mb-6 flex items-end justify-between">
          <h1
            className="aura-display text-[40px] font-normal leading-none"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Hello {customer?.first_name}
          </h1>
          <span className="text-[13px] text-aura-forest/55">
            Signed in as:{" "}
            <span
              className="font-semibold text-aura-forest"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col border-t border-aura-forest/15 py-8">
          <div className="col-span-1 row-span-2 flex h-full flex-1 flex-col gap-y-4">
            <div className="mb-6 flex items-start gap-x-16">
              <div className="flex flex-col gap-y-3">
                <h3 className="aura-display text-[24px] font-normal leading-none">
                  Profile
                </h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="aura-display text-[40px] leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="aura-eyebrow text-aura-gold">Completed</span>
                </div>
              </div>

              <div className="flex flex-col gap-y-3">
                <h3 className="aura-display text-[24px] font-normal leading-none">
                  Addresses
                </h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="aura-display text-[40px] leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="aura-eyebrow text-aura-gold">Saved</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="aura-display text-[24px] font-normal leading-none">
                  Recent orders
                </h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="flex items-center justify-between rounded-[1.5rem] border border-aura-forest/15 bg-[#f5efe4] p-4">
                            <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-x-4 text-[13px] text-aura-forest/70">
                              <span className="font-semibold text-aura-forest">
                                Date placed
                              </span>
                              <span className="font-semibold text-aura-forest">
                                Order number
                              </span>
                              <span className="font-semibold text-aura-forest">
                                Total amount
                              </span>
                              <span data-testid="order-created-date">
                                {new Date(order.created_at).toDateString()}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span data-testid="order-amount">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Go to order #{order.display_id}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span
                    className="text-[15px] text-aura-forest/55"
                    data-testid="no-orders-message"
                  >
                    No recent orders
                  </span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
