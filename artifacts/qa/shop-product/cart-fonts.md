# Cart type

Date: 2026-10-23

Cart display titles now use Hedvig, the same face as the rest of the store. Prices, item names, the quantity control, the promotion line, and buttons use Manrope. Medusa’s Inter type classes are no longer what those cart strings render with.

Measured on the local cart at 1440px after reload:

- “Your cart”, “Order summary”, and “Already have an account?” compute to Hedvig at weight 400.
- “Aura Core”, “Variant: 30-day pouch”, “Promotion(s) applied:”, prices, and the quantity select compute to Manrope.
- The cart drawer title “Your cart” computes to Hedvig. The quantity select computes to Manrope at 14px.

Screenshots: `/opt/cursor/artifacts/cart-fonts-after.png`, `/opt/cursor/artifacts/cart-drawer-fonts.png`.
