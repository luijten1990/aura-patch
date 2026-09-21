---
name: verify-aura-patch
description: Launch, doctor, and drive the Aura Patch Next.js storefront like a shopper. Use to verify homepage, catalog, product, cart, Subscribe & Save, checkout, or account behavior, or when proving a storefront change works.
---

# Verify Aura Patch

Drive the **storefront** the way a shopper does. The Medusa admin at `:9000/app` is out of scope unless the task is explicitly admin.

Default origin: `http://localhost:8000`. Most routes are country-prefixed (`/us`).

## Launch

From repo root:

```bash
npm run backend:dev
npm run storefront:dev
```

Ready when:

- `http://localhost:9000/health` (or Medusa's documented health) responds, and
- `http://localhost:8000/us` returns HTML containing `AURA` and `Shop Aura Core`.

Teardown: stop the processes **this run started**. Do not `pkill node` or kill by process name.

If Postgres or `.env` files are missing, stop and write a blocked doctor report. Do not invent a passing homepage from the Next compile.

## Doctor

Read-only. Run before driving if anything looks off.

1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/us` is `200`.
2. HTML includes `Shop Aura Core` or the current hero CTA.
3. `curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/health` is `200` (or `/store/products` with the publishable key succeeds).
4. Confirm this agent started the servers, or the user confirmed it is safe to share an already-running local instance. Do not drive a production URL as if it were disposable.

If doctor fails, do not mark features verified.

## Drive

Use Cursor browser tools (snapshot, click, fill). Prefer `data-testid` and accessible names:

- Nav store link: `data-testid="nav-store-link"`
- Shop: link named `Shop` → `/us/store`
- Hero CTA: link named `Shop Aura Core`
- Subscribe option: `data-testid="subscribe-option"`
- One-time option: `data-testid="one-time-option"`
- Add to cart: `data-testid="add-product-button"`
- Cart at `/us/cart`

Do not complete a live paid checkout. Stop at payment/review unless the user asked for a sandbox charge.

Recipes: `features/`.

## Evidence

Save under `artifacts/qa/<feature>/`:

- screenshot of the action
- screenshot or snapshot of the resulting state
- notes file with URL, viewport, and pass/fail

Proof standards: real user path; action + result; side effects (cart line text `Subscribe & Save` vs one-time). After cleanup, these files must still exist.

## Cleanup

Stop only the backend/storefront processes launched for this run. Leave `artifacts/qa/` in place. Do not empty the shopper's real cart on production.

## Helpers

```bash
npm run qa:plan
npm run qa
npm run storefront:dev
npm run backend:dev
```

There is no Playwright harness in this repo yet. Browser tools are the driver.
