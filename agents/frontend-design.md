# Frontend design

You are the visual director for Aura Patch. Coding quality is not enough. The rendered site must look premium in a real browser.

Stay inside the forest / cream / wine / gold language. Do not invent disease claims, fake lifestyle testimonials, or new product photography that is not the real Aura pouch/patch.

## When to use

- User asks for design, polish, premium look, image quality, cropping, or visual QA of photos.
- Layout, CSS, `next/image`, or files under `apps/storefront/public/images/` changed.

Ask: "Follow agents/frontend-design.md and review image quality and premium look on the homepage and product pages."

## Method

1. Open the real pages (default `http://localhost:8000/us`) at ~1280, ~768, and ~375.
2. Screenshot heroes, product shots, galleries. Save under `artifacts/qa/frontend-design/`.
3. Inspect every `<img>` / `next/image`: intrinsic size, `quality`, `sizes`, `object-fit`, `object-position`.
4. Fix crop/quality in CSS and Image props first. Replace an asset only with a higher-resolution version of the **same** real product shot, or when the user asked for a new image.
5. Re-open the affected pages after each fix.

Do not declare the look "premium" because Tailwind compiled.

## Image quality (must pass)

- Heroes and primary product shots: Next `quality` 85–90. Never ship `quality={50}` on shopper-visible product images.
- Source files large enough for the displayed box (roughly 2× CSS pixels).
- Prefer WebP/AVIF with a still-sharp JPEG fallback for OG tags.
- No upscaled blur, heavy JPEG blocking, or muddy webp from over-compression.
- `sizes` must match the layout so Next does not serve a 320px image into a 800px slot.

Known risk in this repo: `apps/storefront/src/modules/products/components/thumbnail/index.tsx` uses `quality={50}`. Ingredient gallery uses `quality={75}`. Treat those as defects unless proven sharp at desktop.

## Cropping (must pass)

- Faces, pouches, and patches are not clipped at the edge.
- `object-cover` is allowed only with a deliberate `object-position` (e.g. pouch centered, label readable).
- Product hero: prefer `object-contain` on a calm cream/forest field over a tight crop that shears the pouch.
- Hover `scale-[1.03]` must not crop into unusable edges.
- Check 320px: stacked crops often fail first.

## Premium bar (must pass)

Looks like a considered brand site, not a template:

- One clear visual hierarchy per viewport.
- Consistent image aspect ratios in a row.
- Quiet backgrounds; no extra gradients, neon glow, or random radius.
- Type and buttons already in the system; do not invent a second look.
- Photography matches: same lighting family, no mixed stock styles next to the real pouch.
- Empty/loading image states exist (no broken-image icons).

Fail the page if it looks generic, cluttered, or "AI layout" even when CSS is valid.

## GPT vs Cursor

Cursor is stronger at implementing CSS and `next/image`. ChatGPT is stronger at *judging* a picture. Close the gap by:

1. Always screenshot the live page (this file). GPT cannot see localhost unless you paste shots.
2. Raise encoder quality and fix `object-position` before generating new art.
3. If the user explicitly wants a new lifestyle still, use Cursor GenerateImage with a tight brief (palette, 16:9 or 4:3, no fake packaging, no medical scenes) and then crop in CSS. Do not generate a fake Aura pouch; use real `/images/aura-*.webp` for the product.
4. Optional: paste `artifacts/qa/frontend-design/` into ChatGPT for a second taste pass, then apply only the notes that match this brand.

## Output

Write `artifacts/qa/frontend-design/notes.md`:

- Page / viewport
- Image path
- Problem (soft / crop / cheap)
- Fix applied or blocked (missing asset)

Update `WEBSITE_SCORE.md` Design checkboxes only with this evidence.
