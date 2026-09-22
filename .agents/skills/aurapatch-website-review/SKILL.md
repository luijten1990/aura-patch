---
name: aurapatch-website-review
description: "Review Aurapatch rendered pages for visual consistency, mobile usability, content clarity, and working conversion paths."
---

# Aurapatch — website-review

Run application commands from the repository root. Read `AGENTS.md` before application work.

Read `apps/storefront/src/styles/globals.css`, the existing page components, and any user-supplied reference. Check product selection, purchase-mode clarity, cart totals, subscription disclosures, and checkout navigation where affected. Do not invent efficacy claims, reviews, prices, or discounts.

Use [project verification](../verify-aurapatch/SKILL.md) to start the local app and select the affected journey. Inspect desktop, tablet, and mobile in a real browser, including keyboard focus, overflow, readable text, navigation, relevant loading/error states, and the main call to action. Derive selectors from the current DOM; do not infer visual correctness from source code.

Capture route and viewport with screenshots in the project evidence directory. Distinguish broken behavior, accessibility barriers, unsupported content, and subjective design preferences. Explain alternatives for subjective decisions. Review is read-only unless fixes are requested; in fix mode retest changed pages and stop at the agreed scope. Report browser or startup blockers explicitly.

## Provenance

Project-specific adaptation inspired by Lauren Tan (poteto), [pstack](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-experience-first/SKILL.md). This is a local adaptation, not an upstream installation or automatic update subscription. Cursor-specific tools and model names are intentionally replaced with capabilities actually available in the current session.
