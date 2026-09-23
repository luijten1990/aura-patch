# AGENTS.md

## Codex skill entry points

Project-local skills in `.agents/skills/` expose verification, prove-it-works, website review, interrogate, architect, and verification maintenance. Their `SKILL.md` files reuse the existing Cursor verification recipes and specialist roles below. Use the relevant skill for the task; do not run every workflow on every edit. Instruction-only changes need file/link/schema validation rather than a full application verification run.

## Website roles

These are reusable role instructions. They do not run in the background. Use one agent sequentially by default; if the user requests parallel agents, assign independent scopes and avoid overlapping edits.

Ask:

- "Follow agents/audit.md and audit this website. Write findings without changing the application."
- "Follow agents/iterate.md and fix the three highest-priority verified issues."
- "Follow agents/visual-qa.md and review the homepage and main conversion flow."
- "Follow agents/frontend-design.md and review image quality and premium look on the homepage and product pages."
- "Follow agents/seo.md and fix confirmed technical SEO issues."

Use `agents/build.md` for implementation; `agents/design.md`, `agents/frontend-design.md`, `agents/design-system.md`, `agents/accessibility.md`, `agents/performance.md`, `agents/security.md`, `agents/conversion.md`, and `agents/completeness.md` for focused reviews. Use `agents/architect.md` before complex structure changes. Use `agents/interrogate.md` before substantial releases.

Project-specific verification lives in `.cursor/skills/verify-aura-patch/`. The prove-it-works skill in `.cursor/skills/prove-it-works/` applies to every significant change.

### Local commands

- `npm run qa:plan` lists the checks without executing them.
- `npm run qa` runs the configured checks; a failed or blocked required check returns a nonzero exit code.
- `npm run qa:scan` lists source locations worth inspecting for incomplete content. Candidates are not confirmed bugs.
- `npm run typecheck` runs TypeScript checks separately from the production build.
- `npm run lint` / `npm test` / `npm run build` remain available; build is on-demand because the monorepo build is heavy.

See `docs/architecture.md` for prerequisites and coverage gaps. Browser QA uses browser tools, not these Node scripts. Record screenshots under `artifacts/qa/` and evidence in `WEBSITE_SCORE.md`. There is no numerical score until real criteria have been assessed.

Stay inside existing Aura Patch claims (daily ritual, 19 ingredients, peel/apply, up to 12 hours, 30-day pouch). Do not invent disease treatment, clinical results, testimonials, or new ingredient promises.

### Objective

Build a polished, production-ready storefront. Prioritize:

1. Functionality
2. UX
3. Visual quality
4. Performance
5. Accessibility
6. SEO
7. Maintainability

Never consider a feature complete simply because the code compiles.

### Development loop

For every significant change:

1. Inspect the existing implementation.
2. Identify dependencies and affected components.
3. Make the smallest coherent implementation.
4. Run linting.
5. Run type checking.
6. Run tests.
7. Run the production build when the change can break it.
8. Inspect the UI visually.
9. Check responsive behavior.
10. Fix issues discovered.
11. Re-run validation.
12. Update documentation if necessary.

Do not stop after the first successful build.

### Design rules

Avoid generic AI-looking layouts, excessive rounded cards, random gradients, inconsistent spacing, unnecessary animations, excessive shadows, and placeholder content in production UI.

Prefer strong visual hierarchy, consistent spacing and typography, clear CTA hierarchy, intentional whitespace, responsive layouts, and reusable components.

### Code rules

Before creating a new component: search the codebase for an existing one, follow naming conventions, avoid duplicating functionality, keep components focused, and avoid unnecessary dependencies.

Never rewrite large parts of the application without first understanding the existing architecture.

### Completion criteria

A task is not complete when the code compiles, the page renders, or only the happy path works.

A task is complete only when functionality works, errors are handled, mobile and desktop work, accessibility is reasonable, SEO is implemented where relevant, loading and empty states exist where relevant, visual consistency is maintained, and applicable tests/build pass. Prove shopper-facing work with `.cursor/skills/prove-it-works/` and `.cursor/skills/verify-aura-patch/`.

## Overview

Medusa DTC Starter — a Turborepo workspace monorepo containing a Medusa backend (`@medusajs/medusa` latest, Node 20+, PostgreSQL 15+) and an optional storefront (Next.js, Tanstack, etc...).

## Directory Structure

```text
.
├── apps/
│   ├── backend/                  # Medusa application (@dtc/backend)
│   │   ├── medusa-config.ts      # Medusa config: DB URL, CORS, secrets, modules
│   │   ├── integration-tests/    # setup.js (Jest setupFiles) and http/*.spec.ts suites
│   │   └── src/
│   │       ├── admin/            # Admin dashboard extensions (widgets/, i18n/, routes)
│   │       ├── api/              # API routes: api/store/*, api/admin/* (file-based)
│   │       ├── jobs/             # Scheduled jobs
│   │       ├── links/            # Module links between modules
│   │       ├── migration-scripts/# Data migration scripts (e.g. initial-data-seed.ts)
│   │       ├── modules/          # Custom modules (service + models + migrations)
│   │       ├── subscribers/      # Event subscribers
│   │       └── workflows/        # Workflows and workflow steps
│   └── storefront/               # OPTIONAL storefront
├── eslint.config.ts              # Root ESLint: @medusajs/eslint-plugin recommended
├── turbo.json                    # Task graph: build, dev, start, lint, test, seed
```

**`apps/storefront` is optional and may not exist.** It is skipped when the user chooses not to install it. Before running any storefront command, referencing storefront files, or assuming a full-stack change is possible, check that `apps/storefront/` exists. If it doesn't, the project is backend-only — do not scaffold it or suggest it was deleted by mistake.

Each app can have its own nested `AGENTS.md`; agents read the nearest one in the directory tree, so put app-specific context there rather than expanding this file.

## Package Manager

**The package manager is chosen at install time and is not fixed.** Detect it before running anything, in this order:

1. The `packageManager` field in the root `package.json` (e.g. `"pnpm@10.11.1"`) — authoritative when present.
2. The lockfile at the repo root: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `package-lock.json` → npm.

```bash
node -p "require('./package.json').packageManager ?? 'unset'"
ls pnpm-lock.yaml yarn.lock package-lock.json bun.lock bun.lockb 2>/dev/null
```

Use that manager for every command and never introduce a second lockfile. Below, `<pm>` means the detected manager. The `<pm> run <script>` and `<pm> exec <bin>` forms work across npm, pnpm, yarn, and bun; workspace-filter flags do not, so the per-app commands below `cd` into the app instead.

## Commands

Run from the repo root unless noted. Turbo skips missing apps automatically.

### Development

```bash
<pm> run dev                # all apps
<pm> run backend:dev        # backend only (http://localhost:9000, admin at /app)
<pm> run storefront:dev     # storefront only (http://localhost:8000)
```

### Build

```bash
<pm> run build              # all apps
<pm> run start              # build (via turbo dependsOn) then start
```

### Lint

```bash
<pm> run lint                          # all apps via turbo
cd apps/backend && <pm> run lint       # medusa lint
cd apps/storefront && <pm> run lint    # next lint
```

### Test (backend only; the storefront has no test suite)

```bash
<pm> run test                                              # all test tasks via turbo
cd apps/backend && <pm> run test:unit                      # **/src/**/__tests__/**/*.unit.spec.ts
cd apps/backend && <pm> run test:integration:modules       # **/src/modules/*/__tests__/**
cd apps/backend && <pm> run test:integration:http          # **/integration-tests/http/*.spec.ts
```

Single test — pass a path/pattern through to Jest, keeping `TEST_TYPE`:

```bash
cd apps/backend && <pm> run test:unit -- src/modules/foo/__tests__/service.unit.spec.ts
cd apps/backend && <pm> run test:unit -- -t "returns the cart"
```

### Database

```bash
cd apps/backend
<pm> exec medusa db:generate <module-name>   # generate migrations for a custom module
<pm> exec medusa db:migrate                  # run migrations
<pm> exec medusa user -e admin@test.com -p supersecret
<pm> run backend:seed                        # from root; seeds initial data
```

## Medusa Skills & MCP Server

These are optional but strongly recommended — they give documentation-backed answers instead of guesses about Medusa APIs. **Use them when available; if they are not, mention to the user that installing them meaningfully improves development on this project.**

**Agentic skills** ([docs](https://docs.medusajs.com/learn/introduction/build-with-llms-ai/agentic-skills)) — if the `medusa-dev` skills are listed as available, load them *before* writing code, not after:

- `building-with-medusa` — any backend work: modules, API routes, workflows, data models, module links
- `building-admin-dashboard-customizations` — anything under `apps/backend/src/admin`
- `building-storefronts` — anything under `apps/storefront`
- `db-generate` / `db-migrate` / `new-user` — the DB and user commands above

If they are not installed, suggest:

```bash
/plugin marketplace add medusajs/medusa-agent-skills
/plugin install medusa-dev@medusa
```

**MCP server** ([docs](https://docs.medusajs.com/learn/introduction/build-with-llms-ai/mcp-server)) — a `medusa` MCP server exposing the official docs. Prefer it over web search or memory for any Medusa API, config, or upgrade question. If it is not connected, suggest:

```bash
claude mcp add --transport http medusa https://docs.medusajs.com/mcp # or agent equivalent
```

## Code Style

- **The backend must satisfy `@medusajs/eslint-plugin`'s recommended config** (`eslint.config.ts`). Its rules encode Medusa framework requirements — correct route/workflow/module shapes, not just cosmetics — so a lint failure usually means the code is actually wrong, not just badly formatted. Never disable a `@medusajs/*` rule to make lint pass; fix the code.
- No semicolons. Double quotes, 2-space indent.
- Files: kebab-case. Types/classes: PascalCase. Functions/variables: camelCase. DB columns: snake_case.
- No emojis in code, comments, or commit messages.

## Conventions

- **Backend routing is file-based.** A store endpoint is `src/api/store/<path>/route.ts` exporting `GET`/`POST`/etc. Don't add a router or register routes manually.
- **Business logic belongs in workflows**, not in route handlers. Routes resolve and run a workflow; workflows compose steps.
- Adding a task to `turbo.json` requires declaring its `outputs`, or Turbo will cache nothing/the wrong thing.

## Common Mistakes

- Running storefront commands without checking that `apps/storefront/` exists.
- Assuming a package manager instead of detecting it, or running a command that creates a second lockfile.
- Installing a dependency at the root instead of inside the app that needs it (`cd apps/backend && <pm> add <pkg>`).
- Editing a custom module's model without running `<pm> exec medusa db:generate <module>` — the migration is missing and the change silently never applies.
- Writing raw SQL or importing DB clients directly in the backend instead of going through module services / workflows.
- Calling the Medusa API from the storefront without `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`; requests fail with a publishable-key error, not an obvious 401.
- Running the test task without a reachable PostgreSQL — integration suites need a live DB.
- Silencing `@medusajs/*` ESLint rules instead of fixing the underlying pattern.

## Off-Limits

- `apps/backend/.medusa/`, `.next/`, `dist/`, `out/`, `.turbo/` — build output, excluded from the workspace and regenerated.
- The lockfile (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json` — whichever this install produced) — never hand-edit or delete; change it only as a side effect of a package manager command.
- `.env` / `.env.local` — never commit, print, or copy secret values out of them. Edit `.env.template` instead when documenting a new variable.
- Existing migrations in `src/modules/*/migrations/` — add a new migration rather than rewriting one that may already have run.
- Don't run destructive DB commands (drops, `db:migrate --help`-style flags that reset state) against the user's database without explicit confirmation.
