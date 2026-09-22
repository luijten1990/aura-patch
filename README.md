# Aurapatch — learning to build with AI

**New to vibe coding. Completely hooked on AI.**

[Visit the live website](https://www.getaurapatch.com/us) · [Explore the agent workflows](#the-agent-workflows) · [Project setup](#project-setup)

[![Aurapatch homepage with forest-green navigation, cream background, and Aura Core product imagery](docs/showcase/aurapatch-homepage.png)](https://www.getaurapatch.com/us)

## My story

I'm new to vibe coding, and I'm absolutely loving what AI makes possible. Aurapatch is one of the projects I'm building as I learn: a real website where I can turn ideas into something I can see, use, and keep improving.

I bring the direction, questions, and feedback. AI helps me work through the implementation and explore ways to improve it. There's plenty I still need to learn, but having a real project makes me want to keep going.

One thing I'm learning is to ask better follow-up questions. Does this work on a phone? Does that button actually do what it promises? What evidence do we have that a change works?

That's why I've started adding reusable agent workflows alongside the website. I want checking the work to become part of how I build.

## The project

Aurapatch has a **Next.js / React storefront** and a **Medusa commerce backend**, built on the Medusa DTC Starter. The repository includes product browsing, cart and checkout code, customer accounts, and subscription functionality.

The screenshot above shows the live homepage. It's a visual preview, not a claim that every commerce flow has passed end-to-end testing.

## The agent workflows

Inspired by [Lauren Tan (poteto)](https://github.com/poteto) and her [pstack](https://github.com/cursor/plugins/tree/main/pstack), these project-specific instructions help a coding assistant verify, review, and design changes. They are reusable skills, not bots running continuously in the background.

| Workflow | What it helps me do |
|---|---|
| [Verify Aurapatch](.agents/skills/verify-aurapatch/SKILL.md) | Exercise the storefront like a shopper and capture the result. |
| [Prove it works](.agents/skills/aurapatch-prove-it-works/SKILL.md) | Separate “implemented” from “verified” using actual evidence. |
| [Website review](.agents/skills/aurapatch-website-review/SKILL.md) | Inspect mobile layouts, usability, content, and conversion paths. |
| [Interrogate](.agents/skills/aurapatch-interrogate/SKILL.md) | Challenge substantial changes and investigate concrete failure scenarios. |
| [Architect](.agents/skills/aurapatch-architect/SKILL.md) | Compare approaches before committing to a complex feature. |
| [Maintain verification](.agents/skills/aurapatch-create-verification-skill/SKILL.md) | Keep verification instructions aligned with the changing application. |

The Codex skills live in `.agents/skills/`. They reuse the existing [storefront verification recipes](.cursor/skills/verify-aura-patch/SKILL.md) and [specialist roles](agents/), so the project keeps one shared set of checks.

For example, in a coding session opened in this repository:

- “Use $verify-aurapatch to check the product-to-cart journey in a local test environment.”
- “Use $aurapatch-website-review to review the homepage on mobile.”
- “Use $aurapatch-interrogate to review this change before release.”

## What I'm learning next

I want to get better at checking real user journeys, understanding the code AI helps me write, and making thoughtful choices about what to build next. Existing findings and coverage belong in [AUDIT.md](AUDIT.md) and [WEBSITE_SCORE.md](WEBSITE_SCORE.md); having a workflow installed is not the same as passing its checks.

I'm sharing this as a work in progress. AI has made building things exciting for me, and I want to keep learning by doing it.

## Credits

- [Medusa](https://github.com/medusajs/medusa) and the [DTC Starter](https://github.com/medusajs/dtc-starter) provide the commerce foundation.
- [Lauren Tan's pstack](https://github.com/cursor/plugins/tree/main/pstack) inspired the verification and review approach. The project skills are AI-assisted local adaptations, not an official pstack distribution or workflows I claim to have invented.
- Built with AI coding assistance, with human direction and feedback.

## Project setup

The original starter documentation is retained below. It includes upstream pnpm examples; this repository currently declares **npm** in `package.json` and has a `package-lock.json`. Use the repository's declared package manager and [AGENTS.md](AGENTS.md) for current project commands.

<details>
<summary>Original Medusa DTC Starter documentation and configuration</summary>

<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa DTC Starter
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/medusajs/medusa">
    <img src="https://circleci.com/gh/medusajs/medusa.svg?style=shield" alt="Current CircleCI build status." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

# Medusa DTC Starter

A production-ready monorepo starter for direct-to-consumer ecommerce stores powered by Medusa and Next.js. Includes a fully featured storefront with product browsing, cart, checkout, customer accounts, and order management.

## Features

- All of [Medusa's commerce features](https://docs.medusajs.com/resources/commerce-modules)
- Multi-region support with automatic country detection
- Product catalog with variant selection
- Cart with promotion codes
- Multi-step checkout with shipping and payment
- Customer accounts with order history and address management
- Order transfer between accounts

## Getting Started

### Deploy with Medusa Cloud

The fastest way to get started is deploying with [Medusa Cloud](https://cloud.medusajs.com):

1. [Create a Medusa Cloud account](https://cloud.medusajs.com)
2. Deploy this starter directly from your dashboard

### Local Installation

> **Prerequisites:
>
> - [Node.js](https://nodejs.org/) v20+
> - [PostgreSQL](https://www.postgresql.org/) v15+
> - [pnpm](https://pnpm.io/) v10+

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/medusajs/dtc-starter.git
cd dtc-starter
pnpm install
```

2. Set up environment variables for the backend:

```bash
cp apps/backend/.env.template apps/backend/.env
```

3. Set the database URL in `apps/backend.env`:

```bash
# Replace with actual database URL, make sure the database exists.
DATABASE_URL=postgres://postgres:@localhost:5432/medusa-dtc-starter
```

4. Run migrations:

```bash
cd apps/backend
pnpm medusa db:migrate
```

5. Add admin user:

```bash
cd apps/backend
pnpm medusa user -e admin@test.com -p supersecret
```

6. Start Medusa backend:

```bash
cd apps/backend
pnpm dev
```

7. Open the admin dashboard at `localhost:9000/app` and log in. Retrieve your publishable API key at Settings > Publishable API key.

8. Set up environment variables for the storefront:

```bash
cp apps/storefront/.env.template apps/storefront/.env.local
```

9. Update `apps/storefront/.env.local` with your Medusa publishable API key:

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_6c3...
```

10.  Start storefront:

```bash
cd apps/storefront
pnpm dev
```

The storefront runs on `http://localhost:8000`.

You can slo run the following command from the root to start both backend and storefront:

```bash
pnpm dev
```

## Configuration

The storefront is configured via environment variables in `apps/storefront/.env.local`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Publishable API key from your Medusa backend | — |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | URL of your Medusa backend | `http://localhost:9000` |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region country code | `dk` |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the storefront | `https://localhost:8000` |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key (optional) | — |

## Stripe payments

The storefront already includes Stripe's Payment Element. To enable it, configure
the Medusa backend with server-only secrets:

```bash
STRIPE_API_KEY=rk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

The Stripe provider registers only when both values are set. For an existing
region, replace `pp_system_default` with `pp_stripe_stripe` in Medusa Admin so
customers cannot submit an unpaid manual order. Then configure Stripe to send
these events to
`https://<medusa-backend-url>/hooks/payment/stripe_stripe`:

- `payment_intent.amount_capturable_updated`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Set `NEXT_PUBLIC_STRIPE_KEY=pk_...` only in the storefront's environment. Never
put the restricted API key or webhook secret in browser-visible environment
variables.

## Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Medusa Cloud](https://cloud.medusajs.com)

</details>
