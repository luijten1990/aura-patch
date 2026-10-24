# Core pouch photos

Date: 2026-10-24

The shopper-facing Core pouch is the studio front and back supplied for this update. New filenames avoid the year-long immutable cache on `/images/*`.

## Images

| Path | Where | Problem | Fix |
| --- | --- | --- | --- |
| `public/images/aura-core-pouch-front.webp` | Homepage hero, collection card, product gallery, wholesale, ambassadors, cart and order thumbs | The previous front was a smaller, heavier-compressed file at a cached URL. | 1137×1383 WebP from the supplied front photo. `object-contain`, `quality={90}`. Extra inset padding removed so the studio margin is the frame. |
| `public/images/aura-core-pouch-front.jpeg` | Homepage and product Open Graph, JSON-LD, order email | OG still pointed at the old JPEG, and the email used a Next optimizer URL. | 1137×1383 JPEG, quality 90. Email uses the static file. |
| `public/images/aura-core-pouch-back.webp` | Product gallery back, including `/us/store` | The gallery back was a different transparent label. | 1118×1407 WebP from the supplied back photo. Same `object-contain` frame. Full-size label link still opens this file. |

Cart and order thumbs use `object-contain` for Aura Core so a square crop does not cut the zipper or “30 PATCHES”.

## Viewports

Checked in Chrome on the local storefront:

- 1280: homepage hero, collection card, product front, product back (lot AP261001, expiry 11/2029, Stabilized Allicin on the label), ambassador tile.
- 768: product front. Zipper, mandala, and “30 PATCHES” stay inside the frame.
- 375: homepage hero and product front and back. The back control switches the picture. “Open full-size label” is present.

The pouch is not clipped on the hero or the product gallery. The photo’s cream field sits on the page cream without a hard box.

## Investors hero

Date: 2026-10-24

Page: `/us/investors`

| Path | Problem | Fix |
| --- | --- | --- |
| `public/images/ambassador-create.webp` | The investor hero reused an ambassador portrait in a 4/5 crop. It was not the new pouch. | Replaced on this page only with `public/images/aura-investors-lifestyle.webp`, the supplied 1536×1024 lifestyle photo. The frame is 3/2 so the pouch, patch sheet, and second pouch stay in view. `quality={90}`. Ambassadors still uses the older file. |

Checked at 1280, 768, and 375. The caption sits on a short bottom gradient. The zipper, mandala, and “30 PATCHES” stay visible.

# Review portraits

Date: 2026-10-24

Page: `/us/products/aura-patch` customer reviews, which uses the same review list as `/us/store`.

## Images

| Path | Problem | Fix |
| --- | --- | --- |
| `public/images/reviews/review-kitchen.webp` | Wide stock crop squeezed into an 88px square. The face and patch fell out of the frame. The old URL was cached. | New filename. 960px square portrait, patch on the shoulder. |
| `public/images/reviews/review-outdoors.webp` | Same tight crop. Outdoor shot read as a blurry arm. | New filename. Square portrait outdoors, patch on the upper arm. |
| `public/images/reviews/review-desk.webp` | Desk photo lost the person at thumbnail size. | New filename. Square portrait at a desk, patch on the wrist. |
| `public/images/reviews/review-window.webp` | Resting shot was a dark crop. | New filename. Square portrait by a window, patch on the arm. |
| `public/images/reviews/review-portrait.webp` | Macro of a shoulder, not a person. | New filename. Square portrait, patch on the shoulder. |

The review thumbnail is 112px, `object-cover` centered, `sizes="112px"`, `quality={85}`. Source files are 960×960 WebP.

## Viewports

Checked in Chrome on the product page:

- 1280×900: seven review photos, faces and the small patch visible, no clipped heads.
- 768×1024: same cards, photos stay square beside the quote.
- 375×812: photos stay 112px, text wraps, no overflow.

No Aura pouch was generated. The patch in the photos is a plain nude circle with no logo.
