# I started vibe coding and I cannot go back

My name is Child. A few months ago I was not a “real programmer” in the way people mean it on Twitter. I had a product in my head — Aura Patch, a daily wellness patch at [getaurapatch.com](https://www.getaurapatch.com) — and a lot of tabs. Then I let an AI coding agent into the repo and something clicked.

Vibe coding, for me, is not “generate a landing page and hope.” It is sitting with the agent like a very fast junior teammate: I describe the shopper, the claims we are allowed to make (daily ritual, 19 ingredients, peel/apply, up to 12 hours, a 30-day pouch), and the agent writes, clicks, and argues with the actual site.

I love it. I love watching a storefront go from a Medusa starter to *our* forest-and-gold shop. I love that checkout and Subscribe & Save are real commerce, not a mock. I love that when the agent says “it works,” I can make it prove it.

## The site

Aura Patch is a Next.js storefront on a Medusa backend. Shoppers land on Aura Core, pick Subscribe & Save or one-time, and go through cart and checkout. I still do not let the agent invent disease claims or fake reviews. The AI is the hands. I am the brand.

## The agents

I stole the *idea* of a repeatable website loop (audit → build → visual QA → SEO → conversion), then borrowed the verification mindset from [poteto](https://github.com/poteto)’s [pstack](https://github.com/cursor/plugins/tree/main/pstack): launch the real app, drive it like a user, keep evidence. Compilation is not a vibe. A screenshot of the cart is a vibe.

In this repo that looks like:

- `AGENTS.md` — the constitution, plus Medusa/monorepo facts
- `agents/` — audit, iterate, visual-qa, seo, conversion, and the rest
- `.cursor/skills/verify-aura-patch/` — shopper recipes for home, product, cart, checkout
- `.cursor/skills/prove-it-works/` — no “the build passed” as a finish line
- `npm run qa` — lint, types, subscribe-cart tests

I use one role at a time. Parallel swarms can wait.

## What I would tell past-me

Start with verification, not twenty personalities. Teach the agent how *your* homepage and *your* cart work. Keep a scorecard with empty checkboxes until something has actually been clicked. Credit the people whose workflows you adapted — here, poteto / pstack — and then rewrite them so they match your ports, your `data-testid`s, and your claims.

If you are new: you do not need to already be an engineer to ship. You need taste, constraints, and the nerve to ask the agent to open the browser.

— Child
