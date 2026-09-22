---
name: aurapatch-architect
description: "Compare implementation designs for complex Aurapatch features spanning components, APIs, or persistent state; use before substantial structural changes."
---

# Aurapatch — architect

Run application commands from the repository root. Read `AGENTS.md` before application work.

Ground the design in the current request, existing callers, data structures, and constraints. For a consequential structural decision, sketch two viable approaches and compare complexity, failure modes, integration cost, and testability. Keep a small change small; a button adjustment does not need an architecture exercise.

Show how a caller would use each option and where state belongs. Explain the recommendation and its tradeoff; challenge a premise when evidence contradicts it. Delegate competing sketches only if permitted and useful, otherwise compare them locally. Do not hard-code external model names or require unavailable tools.

Design-only requests end with a recommendation and a verification plan. If implementation is already requested, proceed within that scope using small verifiable changes. If repeated exceptions undermine the design, revisit the structure rather than accumulate patches. Use [project verification](../verify-aurapatch/SKILL.md) for the resulting behavior.

Preserve Medusa module/service/workflow boundaries and existing storefront server/client boundaries. Consider cart currency, purchase type, checkout callbacks, renewal idempotency, and account ownership when relevant. A redesign does not authorize a live migration.

## Provenance

Project-specific adaptation inspired by Lauren Tan (poteto), [pstack](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md). This is a local adaptation, not an upstream installation or automatic update subscription. Cursor-specific tools and model names are intentionally replaced with capabilities actually available in the current session.
