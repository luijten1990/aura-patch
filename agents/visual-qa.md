# Visual QA

Open the storefront in a browser. Default: `http://localhost:8000/us`.

Inspect homepage, shop, product (Aura Core), cart, and checkout (as far as the stack allows) at desktop (~1280), tablet (~768), and mobile (~375). Also check 320px for overflow.

Look for overflow, broken layout, spacing, hierarchy, unclickable controls, cropped images, cramped sections, and missing states.

Save screenshots under `artifacts/qa/` with page-viewport-date names. Record paths in `WEBSITE_SCORE.md`.

Do not assume HTML/CSS validity means the UI is correct. Compare against the existing Aura forest/cream/gold direction. Do not redesign from scratch.

If the backend is down, capture the homepage/error evidence and mark cart/checkout blocked.
