# Review portraits

Date: 2026-10-24

Page: `/us/products/aura-patch` customer reviews, which uses the same review list as `/us/store`.

## Images

| Path | Problem | Fix |
| --- | --- | --- |
| `public/images/reviews/wear-shoulder.webp` | Wide stock crop squeezed into an 88px square. The face and patch fell out of the frame. | Replaced with a 960px square portrait. A woman in a kitchen, small plain patch on the shoulder. |
| `public/images/reviews/wear-day.webp` | Same tight crop. Outdoor shot read as a blurry arm. | Square portrait outdoors, patch on the upper arm. |
| `public/images/reviews/wear-desk.webp` | Desk photo lost the person at thumbnail size. | Square portrait at a desk, patch on the wrist. |
| `public/images/reviews/wear-rest.webp` | Resting shot was a dark crop. | Square portrait by a window, patch on the arm. |
| `public/images/reviews/wear-close.webp` | Macro of a shoulder, not a person. | Square portrait, patch on the shoulder. |

The review thumbnail is 112px, `object-cover` centered, `sizes="112px"`, `quality={85}`. Source files are 960×960 WebP.

## Viewports

Checked in Chrome on the product page:

- 1280×900: seven review photos, faces and the small patch visible, no clipped heads.
- 768×1024: same cards, photos stay square beside the quote.
- 375×812: photos stay 112px, text wraps, no overflow.

No Aura pouch was generated. The patch in the photos is a plain nude circle with no logo.
