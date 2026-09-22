---
name: aurapatch-create-verification-skill
description: "Maintain Aurapatch verification instructions when routes, scripts, integrations, or shopper journeys change."
---

# Maintain Aurapatch verification

Read `AGENTS.md`. Maintain [the canonical verification skill](../../../.cursor/skills/verify-aura-patch/SKILL.md) and its `features/` recipes. Preserve the Codex entry point at [verify-aurapatch](../verify-aurapatch/SKILL.md); do not duplicate the feature map.

Inspect actual package scripts, routes, selectors, test harnesses, and integrations. Update affected launch, readiness, drive, expected-result, and cleanup instructions. Record source-derived recipes as untested until exercised. Prefer existing tooling over new dependencies.

Validate frontmatter and local links. When isolated test services are available, execute one affected journey, capture action and result, stop processes you started, and confirm evidence survives cleanup. Otherwise finish the instruction update and report the precise runtime blocker. Do not repair unrelated infrastructure just to install instructions, overwrite prior evidence, or imply that installed skills guarantee a passing site.

Inspired by [poteto's create-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md).
