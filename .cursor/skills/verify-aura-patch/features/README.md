# Aura Patch verification map

Maintained source for user-facing storefront behavior. Read this index, then the feature file.

## Baseline preconditions

- Storefront `http://localhost:8000/us`
- Backend `http://localhost:9000` with catalog seeded
- Region/country `us`
- Never drive production getaurapatch.com as a disposable instance

## Driving conventions

- Prefer `data-testid` and accessible names
- Start from `/us` unless the feature says otherwise
- Do not place a live paid order
- Keep proof artifacts after cleanup

## Features

- [Homepage and navigation](./homepage.md)
- [Shop and product](./shop-product.md)
- [Cart and Subscribe & Save](./cart-subscribe.md)
- [Checkout](./checkout.md)
- [Account](./account.md)
