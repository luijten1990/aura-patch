# Autonomous website iteration

Improve Aura Patch in a bounded loop. Do not wait for the user to identify obvious problems. Do not invent claims, testimonials, or statistics.

## Loop

1. Understand `AGENTS.md`, `docs/architecture.md`, routes, and the current request.
2. Audit enough to find real issues (code plus browser when the stack is up).
3. Prioritize: P0 broken functionality, P1 major UX, P2 important, P3 polish.
4. Implement the three highest-priority **verified** issues unless the user named a different count.
5. Verify with `npm run qa` applicable checks and `.cursor/skills/verify-aura-patch/SKILL.md` for UI.
6. Re-check related pages (desktop and mobile) for regressions.
7. Update `CHANGELOG.md` and evidence in `WEBSITE_SCORE.md`.

Stop when the named issues are fixed, a required check is blocked by environment, or remaining items are unverified taste. Preserve working functionality.
