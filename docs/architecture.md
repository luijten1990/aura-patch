# Aura Patch architecture (agent coverage)

Aura Patch is a Medusa + Next.js DTC store for getaurapatch.com.

## Apps

- `apps/storefront` — Next.js storefront on port 8000 (`npm run storefront:dev`).
- `apps/backend` — Medusa commerce API and admin on port 9000 (`npm run backend:dev`).

The storefront needs `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and a reachable backend. Cart, checkout, accounts, and Subscribe & Save are not fully exercisable from the storefront alone.

## Package manager

Use npm. Root `package.json` sets `packageManager` to `npm@11.19.0`. Do not add a second lockfile.

## Prerequisites for live verification

- Node 20+
- PostgreSQL 15+ for Medusa
- Backend `.env` from `apps/backend/.env.template`
- Storefront `.env.local` from `apps/storefront/.env.template`
- Seeded catalog including Aura Core

If PostgreSQL, env files, or the publishable key are missing, record a **blocked** check in `WEBSITE_SCORE.md`. Do not mark cart or checkout as verified.

## Main user routes

Country-prefixed (`/us` by default):

- `/` homepage
- `/store` catalog
- `/products/[handle]` product
- `/cart` cart
- `/checkout` checkout
- `/account` login and dashboard
- `/ambassadors`, `/wholesale`, `/investors`
- `/privacy`, `/terms`, `/accessibility`

## Conversion flow

Homepage → Shop Aura Core → product → Subscribe & Save or one-time → cart → checkout.

Do not complete a live paid order unless the user explicitly asks. Stop at review unless using a documented sandbox.

## Coverage gaps

- `npm run qa` does not open a browser.
- Backend integration tests need a live Postgres database.
- Visual QA, SEO rendered output, and conversion review require browser tools plus screenshots in `artifacts/qa/`.
