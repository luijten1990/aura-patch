---
name: prove-it-works
description: Require real user-facing behavior and saved evidence before declaring success. Use after implementing website or commerce changes, or when an agent is about to say something works because lint, types, or the build passed.
---

# Prove it works

A green compile is not proof. Do not declare a storefront, cart, checkout, or content change done until you have exercised the real path and kept evidence.

## Required

1. State the user-visible finish condition in one sentence.
2. Run the smallest automated check that covers the change (`npm run qa` pieces, or the targeted test listed in `AGENTS.md`).
3. Drive the real UI or HTTP path the customer uses. Do not call internal setters or test-only endpoints as a substitute.
4. Capture action + resulting state (screenshot, ARIA snapshot, command output) under `artifacts/qa/`.
5. Note side effects (cart line, inquiry row, email console output) when the feature mutates data.
6. Record the result in `WEBSITE_SCORE.md`. Use `blocked` with the missing prerequisite when the stack cannot start.

## Forbidden as sole evidence

- "The build passed"
- "The code looks correct"
- A screenshot of the editor
- A unit test that never rendered the page

If you cannot drive the app, you may not claim it works. Report the blocker.
