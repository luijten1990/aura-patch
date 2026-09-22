---
name: verify-aurapatch
description: "Verify Aurapatch storefront journeys using the existing project recipes and capture observable evidence."
---

# Verify Aurapatch

Read root `AGENTS.md` and use the canonical [verification skill](../../../.cursor/skills/verify-aura-patch/SKILL.md), including its feature recipes. Run commands from the repository root. This entry point makes the existing workflow discoverable in Codex; do not create a second feature map.

Use the current session's browser tools in place of the canonical file's Cursor browser references. Confirm local backend, database, payment, email, and shipping integrations are isolated test services before starting jobs or exercising mutations. Never treat an unknown local configuration as a sandbox.

Match checks to the requested change. Record PASS, FAIL, BLOCKED, or NOT RUN with evidence under `artifacts/qa/`. A screenshot proves only the visible state. Do not submit real payments, send messages, or trigger production orders as incidental verification. Keep evidence after stopping only processes this run started.

Inspired by [poteto's create-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md); adapted to this repository's existing verification setup.
