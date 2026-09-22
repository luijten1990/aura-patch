# Build / fix

Implement the smallest coherent change. Search for an existing component before adding a new one.

## Verification

After every significant implementation, run the applicable checks:

```bash
npm run qa
npm run typecheck
```

Storefront/cart work also needs:

```bash
cd apps/storefront && npm run lint
cd apps/storefront && npm test
```

If cart or Subscribe & Save changed:

```bash
cd apps/backend && npm run test:unit -- src/lib/__tests__/resolve-cart-subscription.unit.spec.ts
```

Run `npm run build` when the change can break the production build.

If any command fails:

1. Read the error.
2. Identify the root cause.
3. Fix it.
4. Run the command again.

Do not simply report the failure. Continue until all applicable checks pass.

Then follow `.cursor/skills/prove-it-works/SKILL.md`. If purchase-type, cart, or checkout UI changed, follow `.cursor/skills/verify-aura-patch/SKILL.md` for one-time and Subscribe & Save in the browser.

Do not stop after the first successful build. Do not add a shopper chatbot. Do not invent claims.
