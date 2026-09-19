"use client"
import { Radio, RadioGroup } from "@headlessui/react"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { Button, clx, Heading, Text } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

function hasValidCalculatedAmount(
  option: HttpTypes.StoreCartShippingOption,
  calculatedPricesMap: Record<string, number>
) {
  if (option.price_type !== "calculated") {
    return option.amount != null
  }
  const amount = calculatedPricesMap[option.id] ?? option.amount
  return typeof amount === "number" && amount > 0
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => (sm as unknown as { service_zone?: { fulfillment_set?: { type?: string; location?: { address: HttpTypes.StoreCartAddress } } } }).service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => (sm as unknown as { service_zone?: { fulfillment_set?: { type?: string; location?: { address: HttpTypes.StoreCartAddress } } } }).service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        setIsLoadingPrices(true)
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => {
              if (p.value?.id && typeof p.value.amount === "number" && p.value.amount > 0) {
                pricesMap[p.value.id] = p.value.amount
              }
            })

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const selectedMethod = _shippingMethods?.find((option) => option.id === shippingMethodId)
  const selectedRateReady = selectedMethod
    ? hasValidCalculatedAmount(selectedMethod, calculatedPricesMap)
    : false
  const calculatedOptions =
    _shippingMethods?.filter((option) => option.price_type === "calculated") || []
  const onlyCalculatedRates = Boolean(
    _shippingMethods?.length &&
      calculatedOptions.length === _shippingMethods.length
  )
  const ratesUnavailable = Boolean(
    !isLoadingPrices &&
      ((selectedMethod?.price_type === "calculated" && !selectedRateReady) ||
        (onlyCalculatedRates &&
          calculatedOptions.every(
            (option) => !hasValidCalculatedAmount(option, calculatedPricesMap)
          )))
  )
  const deliveryError =
    error ||
    (ratesUnavailable
      ? "Shipping rates temporarily unavailable"
      : null)

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    try {
      const response = await fetch("/api/cart/shipping-method", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          shippingMethodId: id,
        }),
      })
      const result = (await response.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null

      if (!response.ok || !result?.ok) {
        setShippingMethodId(currentId)
        setError(
          result && "error" in result && result.error
            ? result.error
            : "Unable to save that shipping option. Please try again."
        )
        return
      }

      router.refresh()
    } catch (err) {
      setShippingMethodId(currentId)
      setError(err instanceof Error ? err.message : "Unable to save that shipping option.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div>
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className={clx(
            "aura-display flex flex-row items-baseline gap-x-2 text-[32px] font-normal leading-none",
            {
              "pointer-events-none select-none opacity-50":
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55 underline decoration-aura-gold decoration-2 underline-offset-4 transition-colors hover:text-aura-forest"
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </Text>
          )}
      </div>
      {isOpen ? (
        <>
          <div className="grid">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                Shipping method
              </span>
              <span className="mb-4 mt-2 text-[14px] leading-6 text-aura-forest/65">
                How would you like your order delivered
              </span>
            </div>
            <div data-testid="delivery-options-container">
              <div className="pb-8 md:pt-0 pt-2">
                {hasPickupOptions && (
                  <RadioGroup
                    value={showPickupOptions}
                    onChange={(_value) => {
                      const id = _pickupMethods.find(
                        (option) => !option.insufficient_inventory
                      )?.id

                      if (id) {
                        handleSetShippingMethod(id, "pickup")
                      }
                    }}
                  >
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "mb-2 flex cursor-pointer items-center justify-between rounded-[1.25rem] border bg-[#f5efe4] px-6 py-4 text-[14px] text-aura-forest",
                        {
                          "border-aura-gold":
                            showPickupOptions === PICKUP_OPTION_ON,
                          "border-aura-forest/15 hover:border-aura-forest/40":
                            showPickupOptions !== PICKUP_OPTION_ON,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <MedusaRadio
                          checked={showPickupOptions === PICKUP_OPTION_ON}
                        />
                        <span className="text-base-regular">
                          Pick up your order
                        </span>
                      </div>
                      <span className="justify-self-end text-ui-fg-base">
                        -
                      </span>
                    </Radio>
                  </RadioGroup>
                )}
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => {
                    if (v) {
                      return handleSetShippingMethod(v, "shipping")
                    }
                  }}
                >
                  {!_shippingMethods?.length && (
                    <span className="text-[14px] leading-6 text-aura-forest/55">
                      No shipping methods are available for this address. For
                      international orders, confirm the destination country is
                      supported.
                    </span>
                  )}
                  {_shippingMethods?.map((option) => {
                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        className={clx(
                          "mb-2 flex cursor-pointer items-center justify-between rounded-[1.25rem] border bg-[#f5efe4] px-6 py-4 text-[14px] text-aura-forest",
                          {
                            "border-aura-gold":
                              option.id === shippingMethodId,
                            "border-aura-forest/15 hover:border-aura-forest/40":
                              option.id !== shippingMethodId,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <MedusaRadio
                            checked={option.id === shippingMethodId}
                          />
                          <span className="text-[15px]">
                            {option.name}
                          </span>
                        </div>
                        <span className="justify-self-end text-aura-forest">
                          {option.price_type === "flat" ? (
                            convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })
                          ) : hasValidCalculatedAmount(option, calculatedPricesMap) ? (
                            convertToLocale({
                              amount: calculatedPricesMap[option.id] ?? option.amount!,
                              currency_code: cart?.currency_code,
                            })
                          ) : isLoadingPrices ? (
                            <Loader />
                          ) : (
                            "Unavailable"
                          )}
                        </span>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="grid">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                  Store
                </span>
                <span className="mb-4 mt-2 text-[14px] leading-6 text-aura-forest/65">
                  Choose a store near you
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => {
                      if (v) {
                        return handleSetShippingMethod(v, "pickup")
                      }
                    }}
                  >
                    {_pickupMethods?.map((option) => {
                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={clx(
                            "mb-2 flex cursor-pointer items-center justify-between rounded-[1.25rem] border bg-[#f5efe4] px-6 py-4 text-[14px] text-aura-forest",
                            {
                              "border-aura-gold":
                                option.id === shippingMethodId,
                              "border-aura-forest/15 hover:border-aura-forest/40":
                                option.id !== shippingMethodId,
                              "cursor-not-allowed opacity-50 hover:border-aura-forest/15":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <div className="flex flex-col">
                              <span className="text-base-regular">
                                {option.name}
                              </span>
                              <span className="text-base-regular text-ui-fg-muted">
                                {formatAddress(
                                  (option as unknown as { service_zone?: { fulfillment_set?: { location?: { address: HttpTypes.StoreCartAddress } } } }).service_zone?.fulfillment_set?.location
                                    ?.address as HttpTypes.StoreCartAddress
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="justify-self-end text-ui-fg-base">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={deliveryError}
              data-testid="delivery-option-error-message"
            />
            <Button
              size="large"
              className="mt-6 rounded-full !bg-aura-gold px-7 text-[12px] font-semibold uppercase tracking-[0.12em] !text-aura-forest hover:!bg-aura-forest hover:!text-aura-cream"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={
                !shippingMethodId ||
                isLoading ||
                ratesUnavailable ||
                (selectedMethod?.price_type === "calculated" && !selectedRateReady)
              }
              data-testid="submit-delivery-option-button"
            >
              Continue to payment
            </Button>
          </div>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-aura-forest/55">
                  Method
                </Text>
                <Text className="text-[14px] leading-6 text-aura-forest/70">
                  {cart.shipping_methods!.at(-1)!.name}{" "}
                  {convertToLocale({
                    amount: cart.shipping_methods!.at(-1)!.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8 border-aura-forest/15" />
    </div>
  )
}

export default Shipping
