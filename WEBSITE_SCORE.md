# Website quality scorecard

Aura Patch. No numerical score until real criteria have been assessed. Mark items only with evidence (command output, screenshot path, or blocked prerequisite).

Last assessed: 2026-09-22 (homepage only, local storefront already running).

## Functionality

- [x] Navigation (header links present on `/us`; cart empty)
- [ ] Catalog and product pages
- [ ] One-time add to cart
- [ ] Subscribe & Save cart
- [ ] Checkout (stop before live charge unless asked)
- [ ] Account login/dashboard
- [ ] Error handling
- [ ] Loading states
- [ ] Empty cart
- [ ] 404

## Design

- [ ] Typography
- [ ] Spacing
- [ ] Colors
- [ ] Components
- [ ] Visual hierarchy
- [ ] Mobile
- [ ] Tablet
- [ ] Desktop

## SEO

- [ ] Metadata
- [ ] Sitemap
- [ ] Robots
- [ ] Canonicals
- [ ] Structured data
- [ ] Internal linking

## Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Labels
- [ ] Contrast
- [ ] Semantic HTML

## Performance

- [ ] Images
- [ ] Fonts
- [ ] JS
- [ ] CSS
- [ ] Lazy loading

## Content

- [ ] No placeholders
- [ ] No broken links
- [ ] Claims stay within approved copy
- [ ] FAQs
- [ ] Trust elements (no invented testimonials)

## Quality

- [ ] `npm run qa` required checks
- [ ] No TODOs left in production UI copy
- [ ] No console errors on verified pages
- [ ] Subscribe-cart tests

## Evidence

- 2026-09-22: Homepage doctor+drive on existing `localhost:8000/us`. Title, H1, Shop Aura Core, nav verified via accessibility snapshot. Screenshot capture timed out. Notes: `artifacts/qa/homepage/notes.md`. Cart/checkout not driven.
