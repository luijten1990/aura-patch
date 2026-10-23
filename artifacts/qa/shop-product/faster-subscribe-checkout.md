# Subscribe and save checkout speed

Date: 2026-10-23

Finish condition: Subscribe & save leaves the product page for the checkout address form without opening the cart drawer or requesting live shipping quotes, and the payable total is $39.99.

## What changed

- The product, store, and floating Subscribe & save buttons add the pouch and open `/checkout?step=address` in the same click. One-time purchase still opens the cart drawer and stays on the page.
- The add uses the light cart field set, then applies monthly metadata and SUBSCRIBE20 before checkout loads.
- The address step does not list shipping options, payment providers, or EasyPost quotes. Those start when the step is delivery or payment.
- Checkout cart fields no longer contain spaces. A spaced field list made Medusa return empty totals, so the summary showed $49.99 after the promotion was already applied.

## Evidence

Local Medusa and the storefront, warm dev server, desktop 1440x900:

- Product button “Subscribe & save” to the address form: 1047 ms. URL `http://127.0.0.1:8000/us/checkout?step=address`. Cart drawer copy “Your cart will be ready in a moment.” was absent.
- Summary: subtotal $49.99, discount -$10.00, total $39.99 (`data-value` 39.992). Promotion listed: Subscribe & Save 20%.
- No EasyPost or shipping-option request before the address form. Medusa logged `GET /store/shipping-options` only after Continue to delivery.
- Address saved for Alex Morgan, San Francisco. Delivery step opened. This local database has Standard and Express options, and `GET /store/shipping-options?cart_id=...` returned none for that cart, so the delivery step showed the existing empty-state copy.
- One-time purchase stayed on `/us/products/aura-patch`, the button returned to “Add to cart”, and the cart drawer opened.
- Storefront unit tests and `scripts/cart-add.test.cjs`: 27 passed. `next lint` still fails on existing `@ts-ignore` comments in the language select.

Screenshots: `/opt/cursor/artifacts/subscribe-product-before.png`, `/opt/cursor/artifacts/subscribe-checkout-address.png`, `/opt/cursor/artifacts/subscribe-checkout-delivery.png`. Recording: `/opt/cursor/artifacts/subscribe-checkout-speed.mp4`.
