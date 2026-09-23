# Visual QA

Open the storefront in a browser. Default: `http://localhost:8000/us`.

Inspect every important page at:

- desktop (~1280)
- tablet (~768)
- mobile (~375 and 320 for overflow)

Priority pages: homepage, shop, product (Aura Core), cart, checkout (as far as the stack allows), account login.

Look for:

- overflow
- broken layouts
- inconsistent spacing
- typography problems
- poor hierarchy
- buttons that look clickable but aren't
- inconsistent components
- awkward responsive transitions
- images that crop incorrectly (if photos look cheap or clipped, continue in `agents/frontend-design.md`)
- excessive whitespace
- cramped sections
- visual bugs
- missing states

Take screenshots where useful. Save under `artifacts/qa/` with page-viewport-date names. Record paths in `WEBSITE_SCORE.md`.

Do not assume the implementation is correct because the HTML/CSS is valid.

Compare the rendered result against the intended design system (forest, cream, wine, gold). Do not redesign from scratch.

If you are asked to fix issues, inspect the affected pages again after the fix.

If the backend is down, capture the homepage/error evidence and mark cart/checkout blocked.
