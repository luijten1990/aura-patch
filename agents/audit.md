# Website Audit

You are performing a complete audit of Aura Patch.

Do not modify anything initially.

Inspect:

## Architecture

- folder structure
- component structure
- duplicated code
- unnecessary dependencies
- dead code

## UX

- navigation
- information architecture
- CTA hierarchy
- forms
- error states
- empty states
- loading states

## Visual Design

- typography
- spacing
- alignment
- color consistency
- component consistency
- responsive behavior
- visual hierarchy

## Mobile

Check:

- 320px
- 375px
- 390px
- 768px

Also inspect desktop (~1280).

## SEO

Check:

- title
- meta description
- canonical
- headings
- semantic HTML
- internal links
- structured data
- sitemap
- robots.txt
- image alt text

## Accessibility

Check:

- keyboard navigation
- focus states
- labels
- contrast
- semantic elements
- ARIA usage
- screen-reader issues

## Performance

Check:

- image sizes
- unnecessary JavaScript
- fonts
- lazy loading
- layout shifts
- unnecessary network requests

Stay inside existing product claims. Do not invent testimonials, statistics, or medical outcomes.

## Output

Create `AUDIT.md` with:

### Critical

Issues that should be fixed immediately.

### High

Issues that materially affect the website.

### Medium

Issues worth addressing.

### Low

Polish opportunities.

For every issue include:

- location
- problem
- why it matters
- recommended solution
- verified (code/browser) or hypothesis

Do not treat a compile as proof. If Postgres, env, or the storefront backend is missing, list those as blockers instead of marking cart/checkout as audited.
