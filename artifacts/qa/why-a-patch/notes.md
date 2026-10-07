# Why a patch advertorial

Finish condition: a visitor can read the five-reason guide on mobile or desktop, inspect the ingredient list, and follow a country-aware CTA to Aura Core in the configured storefront.

## Implementation

- New country-prefixed `/why-a-patch` route using the existing Aura typography, palette, product image, ingredient data and localized links.
- Practical five-reason narrative, product-design explanation, ingredient disclosure, questions before purchase and three product CTAs.
- No fabricated founder history, endorsements, reviews, study claims, absorption promises or generated customer photographs. No hard-coded price or stock claim.
- The existing floating subscription checkout button is suppressed on this route. The article instead links to product details without mutating the cart.
- Footer discovery link, country-specific canonical/social metadata and US sitemap entry.

## Automated checks

- PASS: existing storefront unit suite, 14 tests.
- PASS: ESLint CLI using the existing `.eslintrc.json` on all four changed TypeScript files (`ESLINT_USE_FLAT_CONFIG=false`).
- FAIL, existing diagnostics: full storefront typecheck reports 26 errors in category, fulfillment, cart utility/tests and checkout files. TypeScript program comparison with and without the new page has the same 26 diagnostics and no new diagnostics; see `typecheck-comparison.json`. The other modified TypeScript files only add a static link, sitemap entry and route guard.
- BLOCKED: normal `npm run lint` and `npm run build` stop at `check-env-variables.js` because `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is missing. No dummy key or configuration bypass was added.
- BLOCKED: root `npm run qa` cannot spawn its npm checks in this Windows runner (exit null); applicable storefront checks were invoked separately using the downloaded npm CLI. Backend checks were not run for this content-only change.

## Isolated visual and interaction checks

These are **component-layout evidence, not a running Medusa/Next storefront or checkout test**. An external temporary harness transpiled the actual page, rendered it with React, compiled the existing Tailwind stylesheet, and served local fonts/product imagery. It substituted a plain image for Next Image and plain country-prefixed anchors for LocalizedClientLink. It omitted the global storefront navigation, popups and footer; CSS module class names were flattened for preview.

- URL: `http://127.0.0.1:3850/us/why-a-patch` (temporary server stopped after QA).
- Desktop 1440x1000: inspected hero hierarchy and image; `desktop-isolated.png`.
- Mobile 390x844: inspected wrapping and fixed product link; no horizontal overflow; `mobile-isolated.png`.
- Narrow mobile 320x740: no horizontal overflow; all article anchor targets exist; product image loaded; all three CTAs point to `/us/products/aura-patch`.
- Opened the ingredient disclosure and purchase-options FAQ through the browser UI. Ingredient disclosure contains 19 items; `ingredients-isolated.png` and `layout-checks.json`.
- Temporary viewport override reset; only this run's preview server stopped.

## Required before merge

Status: **blocked for full storefront verification**. Run in the existing configured Medusa environment with its normal environment variables and database. Verify `/us/why-a-patch` and another configured country, product CTA navigation, native disclosures, global header/popups/footer and fixed-control overlap on mobile. Confirm the subscription floating button is absent only on this route. Run normal lint/build and resolve or separately triage the existing typecheck failures. No live checkout or payment was attempted.
