"use client"
import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import { Heading, Text } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
  regions,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  regions?: HttpTypes.StoreRegion[] | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen =
    searchParams.get("step") === "address" ||
    !cart?.shipping_address?.address_1

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div>
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className="aura-display flex flex-row items-baseline gap-x-2 text-[32px] font-normal leading-none"
        >
          Shipping address
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55 underline decoration-aura-gold decoration-2 underline-offset-4 transition-colors hover:text-aura-forest"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
              regions={regions}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="aura-display pb-6 pt-8 text-[32px] font-normal leading-none"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} regions={regions} />
              </div>
            )}
            <SubmitButton
              className="mt-6 rounded-full !bg-aura-gold px-7 text-[12px] font-semibold uppercase tracking-[0.12em] !text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
              data-testid="submit-address-button"
            >
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                      Shipping Address
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                      Contact
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                      Billing Address
                    </Text>

                    {sameAsBilling ? (
                      <Text className="text-[14px] leading-6 text-aura-forest/70">
                        Billing and delivery address are the same.
                      </Text>
                    ) : (
                      <>
                        <Text className="text-[14px] leading-6 text-aura-forest/70">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="text-[14px] leading-6 text-aura-forest/70">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="text-[14px] leading-6 text-aura-forest/70">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="text-[14px] leading-6 text-aura-forest/70">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[14px] text-aura-forest/55">
                Add a shipping address to continue.
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8 border-aura-forest/15" />
    </div>
  )
}

export default Addresses
