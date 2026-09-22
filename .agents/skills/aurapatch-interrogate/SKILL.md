---
name: aurapatch-interrogate
description: "Adversarial review of significant Aurapatch code changes, release candidates, or explicit requests to challenge an implementation."
---

# Aurapatch — interrogate

Run application commands from the repository root. Read `AGENTS.md` before application work.

This is a review, not permission to apply fixes or ship. Establish the intended behavior and exact review scope. Read surrounding callers, state ownership, and relevant tests. If Git has no useful baseline, review explicit files and say that no before/after diff is available; do not interpret every untracked file as your change.

Use independent reviewers only when the session permits delegation. Give each the same intent, relevant source/diff, and rubric without your proposed findings. Use available models; never promise model diversity when only one model is available. If delegation is unavailable, perform a single review and label it honestly. Keep reviewers read-only and their file scopes explicit.

Look for broken user paths, incorrect data or state transitions, error recovery, authorization mistakes, sensitive data exposure, and unjustified complexity. Read [the verification recipes](../../../.cursor/skills/verify-aura-patch/SKILL.md) for project-specific behavior. Require a source location and concrete failure scenario for each finding. Reproduce consequential findings where the environment permits. Reviewer consensus is a lead, not proof; a single substantiated finding can outrank a shared misconception.

Deduplicate and classify findings as act on, consider, or dismissed, with severity, evidence, rationale, and a verification step. Separate speculative concerns from demonstrated defects. Do not recommend a rewrite or dependency solely for stylistic preference.

## Provenance

Project-specific adaptation inspired by Lauren Tan (poteto), [pstack](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md). This is a local adaptation, not an upstream installation or automatic update subscription. Cursor-specific tools and model names are intentionally replaced with capabilities actually available in the current session.
