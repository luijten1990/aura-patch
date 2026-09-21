# Shop and product

Shop lists the Aura collection. A product page lets the shopper pick Subscribe & Save or one-time.

## Sub-features

- `store-list` shows products at `/us/store`.
- `product-core` opens Aura Core (or the first in-stock product if Core is missing).
- `purchase-type` shows Subscribe & Save and One-time purchase.

## How to get to it (user POV)

- Header Shop, or hero Shop Aura Core, or `/us/products/<handle>`

## Driving it with browser tools

Preconditions:

- Doctor passed including backend catalog.

- **Open store.** Go to `/us/store`. At least one product link is visible.
- **Open product.** Follow Shop Aura Core or a product card. URL includes `/products/`.
- **See purchase types.** `data-testid="subscribe-option"` and `data-testid="one-time-option"` are present.
- **Proof.** Screenshot `artifacts/qa/shop-product/product.png` showing both purchase types.

## Gotchas

- Handles can change; if Aura Core is missing, say so and use another in-stock product.
- Mobile uses `MobileActions`; scroll to the sticky CTA if the desktop buttons are hidden.
