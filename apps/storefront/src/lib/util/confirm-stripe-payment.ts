import { HttpTypes } from "@medusajs/types"
import type { Stripe, StripeElements } from "@stripe/stripe-js"

export const stripePaymentReturnUrl = (
  cartId: string,
  countryCode: string | string[] | undefined
) =>
  `${window.location.origin}/api/payment-return?cart_id=${cartId}&country_code=${countryCode ?? ""}`

const isAuthorizedIntent = (status?: string) =>
  status === "requires_capture" || status === "succeeded"

export const confirmStripePayment = async ({
  stripe,
  elements,
  cart,
  countryCode,
}: {
  stripe: Stripe
  elements: StripeElements
  cart: HttpTypes.StoreCart
  countryCode: string | string[] | undefined
}) => {
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: stripePaymentReturnUrl(cart.id, countryCode),
      payment_method_data: {
        billing_details: {
          name:
            cart.billing_address?.first_name +
            " " +
            cart.billing_address?.last_name,
          address: {
            city: cart.billing_address?.city ?? undefined,
            country: cart.billing_address?.country_code ?? undefined,
            line1: cart.billing_address?.address_1 ?? undefined,
            line2: cart.billing_address?.address_2 ?? undefined,
            postal_code: cart.billing_address?.postal_code ?? undefined,
            state: cart.billing_address?.province ?? undefined,
          },
          email: cart.email,
          phone: cart.billing_address?.phone ?? undefined,
        },
      },
    },
    redirect: "if_required",
  })

  if (error) {
    const intentStatus = error.payment_intent?.status

    if (isAuthorizedIntent(intentStatus)) {
      return { authorized: true as const }
    }

    return {
      authorized: false as const,
      message: error.message || "Payment could not be confirmed.",
    }
  }

  if (isAuthorizedIntent(paymentIntent.status)) {
    return { authorized: true as const }
  }

  return {
    authorized: false as const,
    message: "Payment needs another step. Try again or choose a different method.",
  }
}
