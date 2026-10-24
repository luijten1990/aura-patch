# Shipping quotes start on the address form

Date: 2026-10-24

Finish condition: the carrier quote request starts while the address form is still open, and Continue to delivery does not start a second one.

## What changed

- Checkout asks for rates once the street, city, postal code, and country are filled, about 400 ms after the shopper stops typing.
- That request sends the address with the cart. It does not wait for the address save.
- All four checkout options come from one EasyPost shipment. A second request for the same country and postal code uses the 15-minute rate cache.
- The delivery step reuses that in-flight or cached quote instead of starting another carrier call.

## Evidence

Local Medusa has no EasyPost key, so the quote returns no rates and this database still has no US shipping zone. The timing below is the request path, not a live carrier response.

- Address form visible, then `POST /api/cart/shipping-quotes` at 425 ms, while the URL was still `/us/checkout?step=address`.
- That request returned 200. Medusa logged one `POST /store/easypost/checkout-quotes` (503, no EasyPost provider), not four.
- Continue to delivery showed the delivery section in 29 ms. No second shipping-quotes request was started.
- EasyPost unit test: `describeCheckoutRates` calls the carrier once and the second call is served from cache. 6 tests passed.
- The open cart already had two subscribe pouches from an earlier one-time add, so the summary total was $79.98.

Screenshots: `/opt/cursor/artifacts/shipping-quote-address.png`, `/opt/cursor/artifacts/shipping-quote-delivery.png`. Recording: `/opt/cursor/artifacts/shipping-quotes-start-on-address.mp4`.
