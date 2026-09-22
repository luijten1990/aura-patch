# Autonomous website iteration

Your job is to continuously improve this website.

Do not wait for the user to identify obvious problems.

Work in a bounded loop. Default: the three highest-priority **verified** issues unless the user named a different count.

## STEP 1 — UNDERSTAND

Inspect:

- AGENTS.md
- package.json
- routes
- components
- styles
- assets
- existing documentation (`docs/architecture.md`)

Understand the architecture before modifying it.

## STEP 2 — AUDIT

Inspect functionality, UX, design, responsive behavior, accessibility, SEO, performance, security, and content completeness. Use the browser when the stack is up.

## STEP 3 — PRIORITIZE

Create a backlog:

- P0 = broken functionality
- P1 = major UX/design problems
- P2 = important improvements
- P3 = polish

Work on the highest-value issue first.

## STEP 4 — IMPLEMENT

Implement the improvement. Reuse existing components whenever possible. Avoid unnecessary dependencies.

## STEP 5 — VERIFY

Run lint, typecheck, tests, and (when relevant) build. Then visually inspect the affected page. Follow prove-it-works and `verify-aura-patch`.

## STEP 6 — RE-AUDIT

Ask: "Did this change create any new problems?"

Check desktop, mobile, related components, navigation, accessibility, and performance.

## STEP 7 — FIX

Fix problems discovered during verification.

## STEP 8 — DOCUMENT

Update `CHANGELOG.md` and evidence in `WEBSITE_SCORE.md` with what changed, why, files affected, and validation performed.

## STEP 9 — CONTINUE

Find the next highest-value improvement. Do not stop after one small improvement if additional clearly actionable verified work remains inside the bound.

## IMPORTANT

Never invent business claims, testimonials, or statistics.

Never make destructive architectural changes without justification.

Never replace working functionality merely for stylistic preference.

Preserve existing functionality unless improving it intentionally.

The objective is not maximum code changes. The objective is a progressively better website.

Stop when the named issues are fixed, a required check is blocked by environment, or remaining items are unverified taste.
