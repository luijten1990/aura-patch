# Website quality scorecard

Aura Patch. No numerical score until real criteria have been assessed. Mark items only with evidence (command output, screenshot path, or blocked prerequisite).

## Why-a-patch advertorial (2026-10-02)

Draft implementation at `/[countryCode]/why-a-patch`. Targeted lint and 14 storefront tests pass. Typecheck has the same 26 existing diagnostics with and without the new page. Desktop/mobile isolated component layout and disclosure checks pass. Full storefront verification and production build remain **blocked** by missing Medusa environment configuration; isolated screenshots do not establish a working purchase flow. Evidence and remaining checks: [advertorial QA notes](artifacts/qa/why-a-patch/notes.md).

Last assessed: 2026-09-22 (full read-only audit; local storefront + Medusa already running). Findings: `AUDIT.md`.

## Functionality

- [x] Navigation (header links on `/us`; mobile menu control present at 375px)
- [ ] Forms (contact is mailto; newsletter success is optimistic; not submitted)
- [ ] Authentication (sign-in UI verified; password field unlabeled; password update stubbed in code)
- [x] Catalog and product pages (shop + PDP rendered; catalog is Core only)
- [ ] One-time add to cart (PDP control present; path not completed)
- [ ] Subscribe & Save cart (PDP + floating/quick-add exist; path not completed)
- [ ] Checkout (stop before live charge unless asked) — empty checkout in-browser was 404
- [x] Error handling (error.tsx and 404 exist; quality called out in AUDIT.md)
- [x] Loading states (checkout form Suspense copy in code; not the focus of this pass)
- [x] Empty states (empty cart verified)
- [x] 404 (`/us/this-page-does-not-exist` → “Page not found” / “Go to frontpage”)

## Design

- [x] Typography (Hedvig + Manrope; hierarchy is strong; mixed title case)
- [x] Spacing (generally consistent; PDP/nav overflow issues)
- [x] Colors (forest / cream / gold / wine)
- [ ] Components (starter 404, product tabs, Medusa leftovers)
- [x] Visual hierarchy (homepage clear; shop duplicates homepage)
- [x] Mobile (375px home/account; subscribe bar clipped)
- [ ] Tablet (not separately captured)
- [x] Desktop (shop, PDP, cart screenshots)

## SEO

- [x] Metadata (homepage OK; PDP title triplicated)
- [x] Sitemap (exists; missing product URL)
- [x] Robots (exists; country-prefix gap)
- [ ] Canonicals (homepage only)
- [x] Structured data (homepage JSON-LD includes invented ratings)
- [x] Internal linking (nav/footer hashes; no store search)

## Accessibility

- [ ] Keyboard navigation (country hover-only; no skip link; not fully tab-tested)
- [ ] Focus states (menu `focus:outline-none`)
- [ ] Labels (account password unlabeled)
- [ ] Contrast (not measured with a contrast tool)
- [ ] Semantic HTML (nested main; PDP h2 instead of h1)

## Performance

- [x] Images (public originals mostly <100KB; jpeg+webp duplicates)
- [x] Fonts (local TTF, display swap)
- [ ] JS (not profiled)
- [ ] CSS (not profiled)
- [x] Lazy loading (next/image; hero/PDP use priority)

## Content

- [ ] No placeholders (product tabs still “-”; coming soon is intentional)
- [ ] No broken links (footer/nav hashes need alignment; not crawl-verified)
- [x] Clear messaging (Core story is clear; subscribe “buy the label” is not)
- [x] FAQs (homepage FAQ present)
- [ ] Trust elements (no invented testimonials) — JSON-LD ratings violate this
- [x] Claims stay within approved copy (ingredient gallery includes disclaimers; fake ratings do not)

## Quality

- [ ] No TODOs (account toaster/password, cart inventory TODOs remain)
- [ ] No console errors (Next issues badge shown in mobile screenshots; not captured as text)
- [ ] No duplicated components (shop reuses homepage collection/ingredients)
- [ ] No unnecessary dependencies (`pg`, unused sitemap script, medusa-cta)
- [ ] `npm run qa` required checks (not run this audit)
- [ ] Subscribe-cart tests (not run this audit)

## Evidence

- 2026-10-02: Cart/PDP improvements, transparent label, truthful review state, and footer disclaimer. 21 storefront tests pass. Isolated desktop/mobile component checks pass; full live checkout/build blocked by missing Medusa configuration. See `artifacts/qa/cart-product/notes.md`. Unsupported JSON-LD rating removed; product title now H1. Earlier audit checkboxes above are historical, not a fresh full-site score.

- 2026-09-22: Homepage doctor+drive on existing `localhost:8000/us`. Title, H1, Shop Aura Core, nav verified via accessibility snapshot. Screenshot capture timed out. Notes: `artifacts/qa/homepage/notes.md`. Cart/checkout not driven.
- 2026-09-22: Full audit. Notes: `artifacts/qa/audit/notes.md`. Screenshots under `artifacts/qa/audit/`. Report: `AUDIT.md`.
