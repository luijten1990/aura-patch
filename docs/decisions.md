# Decisions

Website-agent setup (2026-09-22):

- Keep Medusa `AGENTS.md` conventions and add a website-role loop on top.
- Verification skill drives the storefront like a shopper; do not complete live paid checkout unless asked.
- `npm run qa` covers lint, types, and subscribe-cart tests. Production `npm run build` is on-demand because the monorepo build is heavy.
- Scorecard checkboxes stay empty until evidence exists. No numerical score.
