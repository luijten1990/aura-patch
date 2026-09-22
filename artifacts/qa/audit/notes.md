# Website audit evidence (2026-09-22)

Doctor: existing local storefront `http://localhost:8000/us` HTTP 200. Backend `http://localhost:9000/health` HTTP 200. Did not start or stop those processes.

## Driven

- Homepage `/us` (IPv6 `[::1]` stable; `localhost` once hit `error.tsx` “This page is catching up.”)
- Shop `/us/store`
- PDP `/us/products/aura-patch`
- Empty cart `/us/cart` (Cart (0), “Your cart is empty”, Explore products)
- Checkout `/us/checkout` in this browser session → 404 “Go to frontpage” inside checkout chrome
- Account `/us/account` sign-in
- 404 `/us/this-page-does-not-exist`
- Mobile 375px homepage (Emulation.setDeviceMetricsOverride)

## Not driven

- Add to cart (one-time or Subscribe & Save) through cart → checkout
- Payment
- Newsletter / contact submit
- Welcome popup (8s)
- 320 / 390 / 768 viewports as separate captures
- `npm run qa`

## Screenshots (gitignored PNGs)

- `artifacts-qa-audit-store-desktop.png`
- `artifacts-qa-audit-pdp-desktop.png`
- `artifacts-qa-audit-cart-empty.png`
- `artifacts-qa-audit-account-signin.png` (narrow/mobile chrome)
- `artifacts-qa-audit-home-375.png`
- `checkout-empty-404.png`

## Curl titles

- `/us` → Aura Core — Daily Wellness Patch | Aura Patch (canonical present, JSON-LD present)
- `/us/products/aura-patch` → Aura Patch | Aura Patch | Aura Patch (no canonical, description “Aura Patch”, no JSON-LD)
- `/us/store?q=foo` → same shop page, no search
- `/sitemap.xml` → no product URL
- `/robots.txt` → disallows `/cart/` not `/us/cart`
