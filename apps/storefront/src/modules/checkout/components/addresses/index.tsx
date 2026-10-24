"use client"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import { Heading, Text, Button } from "@modules/common/components/ui"
import { usePathname, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { prefetchCheckoutQuotes } from "@lib/util/checkout-quotes"
import { useCheckoutCart } from "../checkout-cart-provider"
import { useCheckoutStep } from "../checkout-step"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"

function readAddress(form: FormData, prefix: string): HttpTypes.StoreCartAddress {
  return {
    first_name: String(form.get(`${prefix}.first_name`) || ""),
    last_name: String(form.get(`${prefix}.last_name`) || ""),
    address_1: String(form.get(`${prefix}.address_1`) || ""),
    address_2: "",
    company: String(form.get(`${prefix}.company`) || ""),
    postal_code: String(form.get(`${prefix}.postal_code`) || ""),
    city: String(form.get(`${prefix}.city`) || ""),
    country_code: String(form.get(`${prefix}.country_code`) || "").toLowerCase(),
    province: String(form.get(`${prefix}.province`) || ""),
    phone: String(form.get(`${prefix}.phone`) || ""),
  } as HttpTypes.StoreCartAddress
}

const Addresses = ({
  cart,
  customer,
  regions,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  regions?: HttpTypes.StoreRegion[] | null
}) => {
  const { cart: liveCart, setCart } = useCheckoutCart(cart || undefined)
  const currentCart = liveCart || cart
  const { step, setStep } = useCheckoutStep()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = step === "address"
  const [message, setMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (step !== "address" && !currentCart?.shipping_address?.address_1 && !isSaving) {
      setStep("address")
    }
  }, [currentCart?.shipping_address?.address_1, isSaving, setStep, step])

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    currentCart?.shipping_address && currentCart?.billing_address
      ? compareAddresses(currentCart?.shipping_address, currentCart?.billing_address)
      : true
  )

  const handleEdit = () => {
    setStep("address")
  }

  const checkoutCountry = pathname.split("/").filter(Boolean)[0] || "us"

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setIsSaving(true)
    const form = new FormData(event.currentTarget)
    const selectedCountry = String(form.get("shipping_address.country_code") || checkoutCountry).toLowerCase()
    const staysHere = selectedCountry === checkoutCountry
    void prefetchCheckoutQuotes(readAddress(form, "shipping_address"))
    if (staysHere) {
      setStep("delivery")
    }
    try {
      const response = await fetch("/api/cart/addresses", {
        method: "POST",
        body: form,
      })
      const result = (await response.json().catch(() => null)) as
        | { ok: true; countryCode?: string }
        | { ok: false; error?: string }
        | null

      if (!response.ok || !result?.ok) {
        if (staysHere) {
          setStep("address")
        }
        setMessage(
          result && "error" in result && result.error
            ? result.error
            : "Unable to save that address. Please try again."
        )
        return
      }

      const nextCountry = (
        "countryCode" in result && result.countryCode
          ? result.countryCode
          : checkoutCountry
      ).toLowerCase()
      const shippingAddress = readAddress(form, "shipping_address")
      const sameAsBilling = form.get("same_as_billing") === "on"
      if (currentCart) {
        setCart({
          ...currentCart,
          email: String(form.get("email") || currentCart.email || ""),
          shipping_address: shippingAddress,
          billing_address: sameAsBilling
            ? shippingAddress
            : readAddress(form, "billing_address"),
        })
      }
      if (nextCountry !== checkoutCountry) {
        router.push(`/${nextCountry}/checkout?step=delivery`)
        return
      }
      setStep("delivery")
    } catch (error) {
      if (staysHere) {
        setStep("address")
      }
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : "Unable to save that address. Please try again."
      )
    } finally {
      setIsSaving(false)
    }
  }

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
        {!isOpen && currentCart?.shipping_address && (
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
        <form onSubmit={handleSubmit}>
          <div className="pb-8">
            <input type="hidden" name="checkout_country" value={checkoutCountry} />
            <input
              type="hidden"
              name="same_as_billing"
              value={sameAsBilling ? "on" : "off"}
            />
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={currentCart}
              regions={regions}
              defaultCountry={checkoutCountry}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="aura-display pb-6 pt-8 text-[32px] font-normal leading-none"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={currentCart} regions={regions} />
              </div>
            )}
            <Button
              type="submit"
              size="large"
              isLoading={isSaving}
              className="mt-6 rounded-full !bg-aura-wine px-7 text-[12px] font-semibold uppercase tracking-[0.12em] !text-aura-cream hover:!bg-aura-forest hover:!text-aura-cream"
              data-testid="submit-address-button"
            >
              Continue to delivery
            </Button>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {currentCart && currentCart.shipping_address ? (
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
                      {currentCart.shipping_address.first_name}{" "}
                      {currentCart.shipping_address.last_name}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {currentCart.shipping_address.address_1}{" "}
                      {currentCart.shipping_address.address_2}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {currentCart.shipping_address.postal_code},{" "}
                      {currentCart.shipping_address.city}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {currentCart.shipping_address.country_code?.toUpperCase()}
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
                      {currentCart.shipping_address.phone}
                    </Text>
                    <Text className="text-[14px] leading-6 text-aura-forest/70">
                      {currentCart.email}
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
                          {currentCart.billing_address?.first_name}{" "}
                          {currentCart.billing_address?.last_name}
                        </Text>
                        <Text className="text-[14px] leading-6 text-aura-forest/70">
                          {currentCart.billing_address?.address_1}{" "}
                          {currentCart.billing_address?.address_2}
                        </Text>
                        <Text className="text-[14px] leading-6 text-aura-forest/70">
                          {currentCart.billing_address?.postal_code},{" "}
                          {currentCart.billing_address?.city}
                        </Text>
                        <Text className="text-[14px] leading-6 text-aura-forest/70">
                          {currentCart.billing_address?.country_code?.toUpperCase()}
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
