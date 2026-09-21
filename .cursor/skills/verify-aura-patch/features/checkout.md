# Checkout

Checkout collects address, shipping, and payment. Verification stops before a live charge.

## Sub-features

- `checkout-open` opens `/us/checkout` from a non-empty cart.
- `checkout-fields` shows contact/address or the current step.
- `checkout-subscribe-copy` mentions monthly Subscribe & Save charging when the cart is a subscription.

## How to get to it (user POV)

- Cart → checkout button → `/us/checkout`

## Driving it with browser tools

Preconditions:

- Cart has a line item.
- Stripe/PayPal may be absent locally; that is a blocked payment step, not a failed open.

- **Open checkout.** From cart, continue to checkout. URL includes `/checkout`.
- **Observe.** Contact or address fields render, or a clear error from a missing backend is recorded.
- **Stop.** Do not submit a real card. Screenshot `artifacts/qa/checkout/review.png`.

## Gotchas

- Empty cart should not be used as checkout proof.
- Missing `NEXT_PUBLIC_STRIPE_KEY` blocks payment UI; record blocked, still verify the page opened if it did.
