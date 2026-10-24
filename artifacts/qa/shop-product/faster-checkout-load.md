# Faster checkout steps

Date: 2026-10-24

Finish condition: Subscribe & save still opens the address form, and Continue to delivery shows the delivery step without reloading checkout. The payable total stays $39.99.

## What changed

- Checkout keeps the current step in memory. Changing steps no longer updates the query string, because that made Next.js refetch the whole checkout page.
- Continue to delivery switches the step as soon as the click is handled. The address save and the shipping lookup finish behind that step.
- Delivery loads shipping options and carrier quotes together. A quote that already has a price is used as the rate, so checkout does not also call calculate for that option.
- The checkout page loads a smaller cart, in parallel with the customer and region list. Payment providers start loading while the address form is open.
- Address saves ask Medusa for the cart id only. The summary is updated from the form.

## Evidence

Local Medusa and the storefront, desktop Chrome, `http://127.0.0.1:8000`:

- Subscribe & save on `/us/products/aura-patch` opened `/us/checkout?step=address`. Click to the address form was 1156 ms. The checkout document itself reached DOMContentLoaded in 309 ms (TTFB 144 ms). The add-to-cart request occupied the rest of that click.
- Summary for one pouch: subtotal $49.99, discount -$10.00, total $39.99. Promotion: Subscribe & Save 20%.
- Continue to delivery showed the delivery section in 6 ms. The address stayed `http://127.0.0.1:8000/us/checkout?step=address`. No request went to `?step=delivery`.
- Address save returned in 522 ms after the delivery section was already open. This local US region has no shipping zone, so the section then showed the existing copy: “No shipping methods are available for this address.”
- One-time purchase stayed on the product page. The button returned to “Add to cart” and the cart count went from 1 to 2.
- Storefront tests: 27 passed. Backend lint: 0 errors, 4 existing warnings. `next lint` still fails on the existing `@ts-ignore` comments in the language select.

Screenshots: `/opt/cursor/artifacts/checkout-address-step.png`, `/opt/cursor/artifacts/checkout-delivery-step.png`. Recording: `/opt/cursor/artifacts/checkout-step-loads-without-refetch.mp4`.
