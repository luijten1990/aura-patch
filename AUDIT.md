# Aura Patch website audit

## 2026-10-25 (Asia/Bangkok)

Local storefront `http://localhost:8000` and Medusa `http://localhost:9000/health` both returned 200. The Next dev server was restarted onto current `main` before the second pass. No application code was changed.

### Critical

**Shop Aura Core has nowhere to land in this database**

- Location: `GET /us/products/aura-patch`; hero link in `apps/storefront/src/modules/home/components/hero/index.tsx`; catalog from `GET /store/products`.
- Problem: The product page renders “Page not found.” The store API returns only Medusa Sweatshirt, T-Shirt, Sweatpants, and Shorts. `/us/store` is HTTP 200 and lists those apparel products. There is no `aura-patch` handle.
- Why it matters: Homepage → Shop Aura Core → Subscribe & Save cannot be completed. The shop shows the wrong products.
- Recommended solution: Seed or restore the Aura Core product (handle `aura-patch`, 30-day pouch, one-time and subscription prices) on this database. `apps/backend/src/migration-scripts/initial-data-seed.ts` still creates the Medusa apparel catalog only. Do not invent a price in the storefront.
- Verified: browser and curl. `docs/architecture.md` expects a seeded Aura Core catalog.

**An older Next process crashed `/us/store` before restart**

- Location: `apps/storefront/src/modules/products/components/thumbnail/index.tsx` (`quality={50}`) and `apps/storefront/next.config.js` (`images.qualities`).
- Problem: The process that was already running threw `Invalid quality prop (50)` and the browser showed “This page is catching up.” Current `main` already lists `50` in `images.qualities`. After restart, `/us/store` is HTTP 200 and that error is gone.
- Why it matters: A stale dev server looks like a broken shop.
- Recommended solution: Restart Next after `next.config.js` changes. Keep every `quality` value inside `images.qualities`.
- Verified: `/tmp/storefront.log` before restart; curl 200 after restart.

### High

**Product tabs still use clothing-starter copy**

- Location: `apps/storefront/src/modules/products/components/product-tabs/index.tsx`.
- Problem: Copy still says “Is the fit not quite right?” and offers an exchange for fit.
- Why it matters: That is not a pouch policy. It will show on the real product page once Aura Core is in the catalog.
- Recommended solution: Replace with the existing peel/apply, wear up to 12 hours, 30-day pouch facts. Hide empty Material and Dimensions fields.
- Verified: code. The live PDP could not be opened because the product is missing.

**Account password change is still a stub**

- Location: `apps/storefront/src/modules/account/components/profile-password/index.tsx`.
- Problem: Submit logs `Password update is not implemented`.
- Why it matters: Subscribe copy tells people they can manage the account. Password change does nothing.
- Recommended solution: Hide the control until Medusa customer password update is wired, or implement it.
- Verified: code. Sign-in page itself rendered on desktop and at 390px.

**Sitemap still omits the product URL**

- Location: `apps/storefront/src/app/sitemap.ts` and `apps/storefront/src/app/robots.ts`.
- Problem: Sitemap has home, store, and marketing URLs, not `/us/products/aura-patch`. Robots disallows `/cart/`, `/checkout/`, and `/account/` without the country prefix.
- Why it matters: The product URL is the page that should be indexed. Country-prefixed cart and checkout can still be crawled.
- Recommended solution: Add the product URL. Disallow `/*/cart`, `/*/checkout`, and `/*/account`.
- Verified: code.

### Medium

**Shop falls through to whatever product is first**

- Location: `apps/storefront/src/modules/store/templates/index.tsx`.
- Problem: If `aura-patch` is missing, the page titles itself “The Aura Collection” and renders the Medusa apparel grid underneath the static formula chooser.
- Why it matters: A catalog miss looks like a real apparel store instead of an empty or blocked Aura shop.
- Recommended solution: If the Aura handle is missing, show a clear unavailable state and do not list unrelated products.
- Verified: curl HTML contains “Sweatshirt” and does not contain “Subscribe”.

### Low

**Mobile cart close control is present in code**

- Location: `apps/storefront/src/modules/layout/components/cart-dropdown/index.tsx` (`aria-label="Close cart"`).
- Problem: An early mobile screenshot looked like the close control was missing. The button is in the header of the drawer.
- Why it matters: Avoid “fixing” a control that already exists.
- Recommended solution: None until a fresh 390px pass shows it clipped.
- Verified: code. Empty cart drawer opened on desktop.

### Not audited this pass

Subscribe & Save, one-time add to cart, and checkout. Those need an Aura Core variant in the database. No payment was attempted.

Homepage, account sign-in, and the empty cart drawer rendered. Keyboard focus was visible on the homepage “Compare formulas” control.

---

## 2026-09-22

Date: 2026-09-22  
Scope: local storefront `http://localhost:8000` (also `http://[::1]:8000`) with Medusa at `http://localhost:9000`. Application code was not changed.

Doctor: storefront `/us` HTTP 200, backend `/health` HTTP 200. Existing local servers were reused.

Not fully driven (do not treat as passing): one-time vs Subscribe & Save add-to-cart through checkout, paid payment, password reset, newsletter/Brevo success, welcome-offer popup after 8s. Empty checkout in this browser session rendered 404. `npm run qa` was not run (read-only audit).

Viewports captured: ~desktop shop/PDP/cart, 375px homepage and account. 320 / 390 / 768 were not separately screenshotted; `small` Tailwind breakpoint behavior was inspected in CSS.

Evidence: `artifacts/qa/audit/notes.md` and PNG screenshots under `artifacts/qa/audit/` (gitignored).

---

### Critical

**Invented product ratings in structured data**  
- Location: `apps/storefront/src/modules/seo/json-ld.tsx` (`ProductJsonLd` `aggregateRating` 4.8 / 127 reviews); rendered on `/us` (homepage HTML contains 4 JSON-LD blocks).  
- Problem: The homepage publishes a Product schema with fake star ratings and review counts. There is no review UI or data source.  
- Why it matters: This invents social proof, violates the no-testimonials rule, and is a Google rich-results / consumer-trust risk.  
- Recommended solution: Remove `aggregateRating` until reviews are real. Put Product JSON-LD on the product URL only, with live price/availability.  
- Verified: code + homepage HTML (`application/ld+json` present on `/us`, absent on `/us/products/aura-patch`).

**Starter shipping/returns copy on the product page**  
- Location: `apps/storefront/src/modules/products/components/product-tabs/index.tsx` (`ShippingInfoTab`, `ProductInfoTab`).  
- Problem: Accordion still talks about “fit not quite right,” pickup locations, and generic Material / Dimensions fields that show `-`.  
- Why it matters: Shoppers read this as Aura policy. Clothing-starter copy on a 30-day pouch is misleading.  
- Recommended solution: Replace with Aura shipping, returns, and pouch facts only. Hide empty Medusa spec fields.  
- Verified: code. PDP screenshot shows the leftover “Product Information” / “Shipping & Returns” accordions.

**Subscribe CTAs that skip the cart and mislabel purchase type**  
- Location: `apps/storefront/src/modules/layout/components/floating-buy-now/index.tsx`; `apps/storefront/src/modules/store/components/buy-now-button.tsx`; `apps/storefront/src/modules/products/components/product-preview/quick-add-button.tsx`.  
- Problem: Homepage floating bar and shop “Subscribe & save” add a subscription line and route to checkout. Catalog “Add to cart” also forces `purchaseType: "subscription"` while the label says add to cart.  
- Why it matters: Shoppers can land in a recurring charge without a cart review or a clear one-time choice. Label vs behavior is a conversion and trust failure.  
- Recommended solution: Keep Subscribe vs one-time only on the PDP (already present). Quick-add should match its label. Floating checkout skip should be optional and always say it is a subscription.  
- Verified: code + browser (shop shows both “Subscribe & save” and “Add to cart”; PDP has both purchase types).

---

### High

**Empty checkout is a 404 (“Go to frontpage”)**  
- Location: `apps/storefront/src/app/[countryCode]/(checkout)/checkout/page.tsx` (`if (!initialCart) return notFound()`); `apps/storefront/src/app/[countryCode]/(checkout)/not-found.tsx`.  
- Problem: Browser `/us/checkout` with an empty/missing cart showed the checkout chrome plus an unbranded 404. Curl without the same cookies returned 200 and an empty checkout form.  
- Why it matters: A shopper who hits checkout with no cart thinks the store is broken.  
- Recommended solution: Redirect empty checkout to `/us/cart` with the empty-cart message. Never use 404 for a missing cart.  
- Verified: browser. Curl 200 vs browser 404 noted as session-dependent.

**Homepage can dump shoppers into “This page is catching up.”**  
- Location: `apps/storefront/src/app/error.tsx` (auto-reload via `sessionStorage`, then a vague recovery screen). Reproduced by navigating to `http://localhost:8000/us` after a healthy `[::1]` session.  
- Problem: Transient layout/data errors auto-reload, then hide the real error. “Go home” is a `<button>` that assigns `/us`, which can loop the same failure.  
- Why it matters: The primary URL looks down even when Medusa is healthy.  
- Recommended solution: Stop silent auto-reload. Show a retry that calls `reset()`, keep nav, log the digest.  
- Verified: browser + code.

**Product metadata is duplicated and empty of description**  
- Location: `apps/storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx` (`title: \`${product.title} | Aura Patch\`` plus root `template: "%s | Aura Patch"`). Medusa title is “Aura Patch”.  
- Problem: Live title is `Aura Patch | Aura Patch | Aura Patch`. Meta description is just `Aura Patch`. No canonical. No Product JSON-LD on the PDP.  
- Why it matters: The money page is the weakest SEO URL.  
- Recommended solution: Set `title` without a second `| Aura Patch`. Write a real description from approved copy. Add canonical `/us/products/aura-patch`. Move Product schema here with live offer data.  
- Verified: curl + browser title.

**Sitemap omits the product URL; robots miss country-prefixed private routes**  
- Location: `apps/storefront/src/app/sitemap.ts`; `apps/storefront/src/app/robots.ts`.  
- Problem: Sitemap has `/us` and marketing URLs, not `/us/products/aura-patch`. Disallow is `/cart/`, `/checkout/`, `/account/` — not `/us/cart`, etc. `next-sitemap.js` is unused leftover (`siteUrl: NEXT_PUBLIC_VERCEL_URL`).  
- Why it matters: Google may miss the PDP and may index cart/checkout.  
- Recommended solution: Generate product (and collection) URLs from the catalog. Disallow `/*/cart`, `/*/checkout`, `/*/account`. Delete unused `next-sitemap.js`.  
- Verified: `GET /sitemap.xml` and `GET /robots.txt`.

**JSON-LD SearchAction points at a search that does not exist**  
- Location: `WebsiteJsonLd` in `json-ld.tsx`; store page ignores `?q=`.  
- Problem: Schema advertises `https://www.getaurapatch.com/us/store?q={search_term_string}`. `/us/store?q=foo` is 200 but is the same catalog, no search UI.  
- Why it matters: Invalid sitelinks search box.  
- Recommended solution: Remove `potentialAction` until there is real search.  
- Verified: code + curl.

**PDP buy box and desktop nav overflow**  
- Location: product template three-column grid; `nav/index.tsx` plus `CountrySelect` “Shipping to: United States”.  
- Problem: At the audited desktop width the subscribe price and primary button are clipped. Header truncates “Shipping to: Un…” and visually crowds Account/Cart.  
- Why it matters: Price and checkout controls are the conversion UI.  
- Recommended solution: Stack the buy column earlier; shorten country control to flag + code; collapse nav links sooner.  
- Verified: browser screenshots (`artifacts/qa/audit/artifacts-qa-audit-pdp-desktop.png`, store header).

**Subscribe helper copy says “buy the label”**  
- Location: `apps/storefront/src/modules/products/components/product-actions/index.tsx` (~line 260).  
- Problem: “Every month we charge your card, ship a new box, and buy the label.”  
- Why it matters: Sounds like internal ops, not a shopper promise.  
- Recommended solution: Replace with ship-a-pouch / cancel-anytime language already used elsewhere.  
- Verified: code + PDP accessibility name.

**Shop page duplicates the homepage collection + ingredients story**  
- Location: `apps/storefront/src/modules/store/templates/index.tsx` renders `CollectionChooser` and `IngredientsShowcase` after a one-product grid.  
- Problem: `/us/store` repeats “Three formulas. One Aura.” twice more after the H1. Catalog grid only lists Aura Core.  
- Why it matters: Shop feels like a second homepage, not a catalog. Long page, duplicate H2s.  
- Recommended solution: Keep the product card + one short coming-soon note. Leave the long formula story on Home.  
- Verified: browser + code.

**Broken footer Ingredients hash**  
- Location: footer `href: "/#ingredients"` vs nav `href: "/#formulations"`. There is `id="ingredients"` wrapping formulations, so footer may work, but Science on Home is the benefit grid (`id="science"`), not a science page.  
- Problem: IA is hash-only. Collection/Ingredients/FAQ/Contact 404 as standalone pages. Account “View FAQ” goes to `/#faq` (homepage).  
- Why it matters: Deep links and footer paths are fragile; off-home FAQ CTA is confusing.  
- Recommended solution: Keep hashes on Home; point Account FAQ to `/us#faq` explicitly; align footer/nav IDs.  
- Verified: code + account snapshot.

**Contact and newsletter success are optimistic / off-site**  
- Location: `contact-form/index.tsx` (`mailto:`); `newsletter-signup/index.tsx` (250ms timeout then “You’re on the list”).  
- Problem: Contact never hits the server. Newsletter always claims success without reading the Brevo response. Welcome popup (`welcome-popup/index.tsx`) is a separate 8s modal with a real `subscribeWelcomeOffer` path.  
- Why it matters: False confirmation and three competing capture UIs.  
- Recommended solution: One list signup with real error/success. Contact via API or a visible `mailto` that does not claim sent.  
- Verified: code. Forms not submitted in this audit.

**Account password field has no accessible name; password update is a stub**  
- Location: sign-in snapshot (password textbox unnamed; toggle unnamed); `profile-password/index.tsx` TODOs (`console.info("Password update is not implemented")`).  
- Problem: Login a11y is broken; logged-in password change is fake.  
- Why it matters: Account is required for “cancel anytime” copy on Subscribe.  
- Recommended solution: Label password and show/hide. Hide or implement password update.  
- Verified: browser + code.

**No skip link; country switcher is hover-only; menu kills focus rings**  
- Location: `layout.tsx` wraps the whole site in `<main>` (nested `<main>` on cart/store/wholesale); `country-select/index.tsx`; side-menu `focus:outline-none`.  
- Problem: Keyboard users cannot skip nav. Country dropdown has no `aria-expanded` and opens on hover. Hamburger removes outlines.  
- Why it matters: Core a11y failures on every page.  
- Recommended solution: One document `<main>`, skip link, click/keyboard country list, visible focus.  
- Verified: code + snapshots (country is a button without expanded state).

---

### Medium

**Open Graph title does not match the homepage title**  
- Location: `apps/storefront/src/app/[countryCode]/(main)/page.tsx`.  
- Problem: Title is “Aura Core — Daily Wellness Patch”; OG/Twitter is “The Aura Collection — Core, Restore, Energy”.  
- Why it matters: Social shares sell a three-product lineup while only Core is buyable.  
- Recommended solution: Align OG with Core-first copy.  
- Verified: code + homepage HTML.

**Wholesale / ambassadors / investors titles double the brand**  
- Location: page `metadata.title` already includes `| Aura Patch` plus root template.  
- Problem: Titles like `Wholesale | Aura Patch | Aura Patch`. Category/collection generators still say “Medusa Store”.  
- Why it matters: Leftover starter branding in SERPs if those routes get indexed.  
- Recommended solution: Absolute titles (`title: { absolute: "..." }`) or stop appending the suffix. Replace Medusa Store.  
- Verified: curl titles + code.

**Hero does not load the live product, so homepage has no price**  
- Location: `page.tsx` renders `<Hero />` with no `product`; `Hero` supports optional product/price. `FloatingBuyNowLoader` does fetch Aura Core.  
- Problem: Hero card is “Aura Core — 30-day supply” without `$49.99`; the floating bar shows `$39.99/mo`.  
- Why it matters: Price inconsistency before the PDP.  
- Recommended solution: Pass the same product into Hero or drop the floating bar.  
- Verified: code + homepage snapshot.

**Mobile floating Subscribe is clipped**  
- Location: `floating-buy-now/index.tsx` at 375px.  
- Problem: Bar reads as “SAVE | $39.99/mo” and sits on the hero image.  
- Why it matters: Primary mobile CTA is unreadable.  
- Recommended solution: Full-width bar with complete label, extra bottom padding on Home.  
- Verified: `artifacts/qa/audit/artifacts-qa-audit-home-375.png`.

**Prepare / Place / Press / Wear row overflows on desktop**  
- Location: homepage “Designed around skin contact” `medium:grid-cols-4`.  
- Problem: Fourth card (“Wear”) is clipped at the audited width.  
- Why it matters: Looks unfinished; last step of how-to-apply is the one you need.  
- Recommended solution: Four equal columns with `minmax(0,1fr)` or wrap at this breakpoint.  
- Verified: browser screenshot of that section.

**404 pages are unbranded starter screens**  
- Location: `app/not-found.tsx`, country `not-found.tsx`, cart/checkout variants.  
- Problem: “Go to frontpage”, no Aura nav on the root 404. Title/description “404” / “Something went wrong”.  
- Why it matters: Lost sessions should still convert.  
- Recommended solution: Branded 404 with Shop Aura Core.  
- Verified: `/us/this-page-does-not-exist` and checkout 404.

**Cart failure becomes 404**  
- Location: `apps/storefront/src/app/[countryCode]/(main)/cart/page.tsx` (`retrieveCart().catch(() => notFound())`).  
- Problem: API errors look like a missing page. Empty cart itself is fine.  
- Why it matters: Backend blips look like a broken store.  
- Recommended solution: Error state + retry, not `notFound()`.  
- Verified: code. Empty cart UI verified in browser.

**Catalog image link has no accessible name**  
- Location: `product-preview/index.tsx` wraps the pouch image in a link; thumbnail fallback `alt="Thumbnail"`.  
- Problem: Shop snapshot includes a nameless link.  
- Why it matters: Screen readers get an empty control before “Aura Core”.  
- Recommended solution: `alt` plus putting the heading inside the same link, or `aria-label`.  
- Verified: store snapshot.

**Unused / leftover dependencies and components**  
- Location: storefront `package.json` (`pg` with no import, `@types/react-instantsearch-dom`); `medusa-cta`; `next-sitemap.js`; LanguageSelect wired with `locales={null}`. Duplicate jpeg+webp in `public/images`.  
- Problem: Dead starter surface area.  
- Why it matters: Confuses future work; extra bytes in the image folder (images themselves are small, ~2.8MB total).  
- Recommended solution: Remove unused packages/components; keep one image format.  
- Verified: grep + `ls` of `public/images`.

**Welcome popup has no focus trap**  
- Location: `welcome-popup/index.tsx`.  
- Problem: Dialog after 8s, Escape/backdrop work, focus is not moved or trapped. Two list signups already exist on Home.  
- Why it matters: Keyboard and conversion interruption.  
- Recommended solution: Focus trap + one email capture.  
- Hypothesis for the 8s interrupt (timer not waited); code-verified for a11y gaps.

**PDP uses `h2` for the product name; 19 identical “Ingredient notes +” buttons**  
- Location: `product-info/index.tsx`; ingredients gallery.  
- Problem: No `h1` in PDP HTML. Ingredient notes share one accessible name.  
- Why it matters: SEO heading and screen-reader list of 19 identical controls.  
- Recommended solution: `h1` for Aura Core; `aria-label` per ingredient.  
- Verified: curl (no h1) + snapshot.

---

### Low

**Logo images use `alt=""`** next to visible “AURA PATCH” text — acceptable if the adjacent text stays; keep it.  
**Account sign-in title is `Sign in` without the brand template** — inconsistent with other routes.  
**FAQ `<details>` answers remain in the accessibility tree while collapsed** — noisy but usable.  
**Typography mixed case** (“Easy to Use” vs “All-day support”).  
**Nested rounded marketing cards** on Home are heavy relative to the design rules, but the type and color system (forest / cream / gold / wine) is coherent.  
**Local fonts** (Hedvig + Manrope TTF, `display: swap`) are reasonable; no remote font blocking observed.  
**`Hero` is a 270-line page module** — split sections when iterating.  
**Side menu copyright hard-codes `© 2026`** while footer uses `new Date().getFullYear()`.  
**Investor page uses an ambassador lifestyle photo** (`ambassador-create.webp`).  
**Wholesale copy says “Aura Daily Wellness”** while the product is Aura Core.  
**Password and toaster TODOs** in account layout.  
**320 / 390 / 768 not screenshot in this pass** — 375 looked usable besides the clipped subscribe bar; hypothesis that 320 will wrap CTAs more tightly.

---

## Architecture notes (not issues by themselves)

- Apps: Next.js storefront (`apps/storefront`) + Medusa (`apps/backend`). Shopper routes are country-prefixed (`/us`).  
- Homepage is almost entirely `modules/home/components/hero` plus collection/ingredients modules. Commerce UI still sits on Medusa starter paths (cart, checkout, account, product tabs).  
- `isSubscriptionCart` in `lib/util/subscription.ts` is the subscribe source of truth; several CTAs bypass a clear one-time path.

## Suggested fix order

1. Strip fake ratings and leftover shipping/fit copy.  
2. Make Subscribe vs one-time labels match behavior; empty checkout → cart.  
3. Fix PDP title/canonical/schema and sitemap.  
4. Repair nav/PDP overflow and mobile subscribe bar.  
5. Then account labels, contact/newsletter honesty, dead starter files.
