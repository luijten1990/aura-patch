# Cart and Subscribe & Save

Shoppers add a one-time line or a Subscribe & Save line. The cart must show the matching price language and keep the types distinct.

## Sub-features

- `add-subscribe` adds a subscription line.
- `add-one-time` adds a one-time line (use a fresh cart or distinct run).
- `cart-copy` shows Subscribe & Save · 20% off for subscription lines.

## How to get to it (user POV)

- Product page → Subscribe & Save or One-time purchase → Add/Subscribe → `/us/cart`

## Driving it with browser tools

Preconditions:

- Product page loaded with an in-stock variant.
- Do not mix both types in one proof unless that is the scenario.

- **Subscribe.** Click `data-testid="subscribe-option"`, then `data-testid="add-product-button"` labeled `Subscribe & save`. Open `/us/cart`. Line includes Subscribe & Save.
- **One-time.** Click `data-testid="one-time-option"`, then Add to cart. Cart line does not claim Subscribe & Save 20% off as the purchase type.
- **Proof.** Screenshots `artifacts/qa/cart-subscribe/subscribe-cart.png` and `artifacts/qa/cart-subscribe/one-time-cart.png`.

## Gotchas

- `isSubscriptionCart` keys off line `metadata.purchase_type === "subscription"`.
- Promo `SUBSCRIBE20` must not be treated as proof of purchase type by itself.
- A failed add with `role="alert"` is a product bug or stock issue, not a passed cart test.
