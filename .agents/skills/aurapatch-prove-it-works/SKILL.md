---
name: aurapatch-prove-it-works
description: "Establish evidence for completed Aurapatch changes before reporting success, distinguishing implementation from verification."
---

# Prove it works

Read `AGENTS.md`. For application changes follow [the existing prove-it-works skill](../../../.cursor/skills/prove-it-works/SKILL.md) and [verify-aurapatch](../verify-aurapatch/SKILL.md).

For documentation or skill-only edits, inspect the exact diff, validate syntax and relative links, and check rendered output when presentation matters. A full commerce build is not needed for prose alone. Do not report runtime verification from these file checks.

Inspect delegated artifacts rather than trusting an agent summary. Report actual passes, failures, blockers, and untested behavior separately. Stop when the requested acceptance criteria and related regression checks are satisfied.

Inspired by [poteto's prove-it-works principle](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-prove-it-works/SKILL.md).
