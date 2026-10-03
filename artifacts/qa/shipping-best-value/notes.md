# Shipping best value

Date: 2026-10-03

Finish condition: Best value sits on the cheapest paid method, and the list is ordered by price.

Quotes used: free $0.00, USPS $5.58, DHL economy $10.57, DHL Express $21.67.

## Result

- Best value is on USPS.
- DHL is labeled Economy and no longer says it is the lowest-cost carrier.
- Order is free, USPS, DHL economy, express.
- Desktop and mobile screenshots show that order.

## Blocked

Live checkout was not driven. This environment has no Medusa backend, so EasyPost quotes were not fetched. The delivery cards were rendered with these prices through the same badge helper the checkout uses.

Screenshots: `desktop.png`, `mobile.png`.
