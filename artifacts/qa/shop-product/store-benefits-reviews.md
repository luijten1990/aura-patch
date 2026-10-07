# Store page benefits and reviews

Date: 2026-10-07
URL: http://localhost:8000/us/store
Viewport: 1440px desktop, 390px mobile

## Result

Pass. On a 1440×900 viewport the pouch stays in view after scrolling 1600px (photo top 94px, height 567px). The price row shows Normal $49.99 (`data-value` 49.99) and Subscribe $39.99/mo (`data-value` 39.99). The one-time option is $49.99 and Subscribe & Save is $39.99/mo. The normal price is not struck through. The same pair appears on `/us/products/aura-patch` at 390px. The local catalog price had been stored as 4999, which rendered as $4,999; it is now 49.99.

Restore and Energy keep the same benefit blocks on the formulations section of this page.

Screenshots: `/opt/cursor/artifacts/store-normal-subscribe-top.png`, `/opt/cursor/artifacts/product-price-mobile.png`.
Walkthrough: `/opt/cursor/artifacts/store-normal-49-subscribe-39.mp4`.
