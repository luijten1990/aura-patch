# Renewal snapshot prices

Local Subscribe & Save orders were saving a renewal charge of 0. Medusa returns prices as BigNumber objects, and the snapshot builder only accepted plain numbers.

After the parser change:

- New subscription `01M5KXDQEAKE57RMJGVPQ2VP1H` for order `order_01M5KXDQ9ZG6YVR1JWYYPN9Q2Z` stored amount 49.99, unit price 39.99, shipping 10, currency eur.
- Existing subscription `01M5KWCME782K0GTF3BWTD9216` was rebuilt from 0 to the same amounts when `POST /admin/subscriptions/:id/renew` ran with `{ "force": true }`.
- That renew still returned HTTP 400, "No saved payment method was found for this subscription." Each subscription still has one order. Payment rows stayed on `pp_system_default` (2). Stripe payments: 0.

Backend unit test `renewal-snapshot.unit.spec.ts`: 4 passed. Backend lint: 0 errors. Backend `tsc --noEmit`: passed.
