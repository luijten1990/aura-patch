# Website quality scorecard

Aura Patch. No numerical score until real criteria have been assessed. Mark items only with evidence (command output, screenshot path, or blocked prerequisite).

Last assessed: 2026-09-22 (homepage only, local storefront already running).

## Functionality

- [x] Navigation (header links present on `/us`; cart empty)
- [ ] Forms
- [ ] Authentication
- [ ] Catalog and product pages
- [ ] One-time add to cart
- [ ] Subscribe & Save cart
- [ ] Checkout (stop before live charge unless asked)
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
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
- [ ] Clear messaging
- [ ] FAQs
- [ ] Trust elements (no invented testimonials)
- [ ] Claims stay within approved copy

## Quality

- [ ] No TODOs
- [ ] No console errors
- [ ] No duplicated components
- [ ] No unnecessary dependencies
- [ ] `npm run qa` required checks
- [ ] Subscribe-cart tests

## Evidence

- 2026-09-22: Homepage doctor+drive on existing `localhost:8000/us`. Title, H1, Shop Aura Core, nav verified via accessibility snapshot. Screenshot capture timed out. Notes: `artifacts/qa/homepage/notes.md`. Cart/checkout not driven.
