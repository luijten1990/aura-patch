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
