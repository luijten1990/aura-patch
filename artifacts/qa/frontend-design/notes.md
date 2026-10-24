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
