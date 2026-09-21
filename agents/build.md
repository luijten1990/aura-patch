# Build / fix

Implement the smallest coherent change. Search for an existing component before adding a new one.

## After implementation

1. Lint the app you changed.
2. Run storefront tests (`cd apps/storefront && npm test`).
3. If cart or Subscribe & Save changed, run `cd apps/backend && npm run test:unit -- src/lib/__tests__/resolve-cart-subscription.unit.spec.ts`.
4. Follow `.cursor/skills/prove-it-works/SKILL.md`.
5. If purchase-type, cart, or checkout UI changed, follow `.cursor/skills/verify-aura-patch/SKILL.md` for one-time and Subscribe & Save in the browser.

Do not stop after the first successful build. Do not add a shopper chatbot. Do not invent claims.
