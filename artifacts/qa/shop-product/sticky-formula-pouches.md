# Sticky formula pouches

Date: 2026-10-21
URL: http://127.0.0.1:8000/us#formulations
Viewport: 1440×900 desktop, 390×844 mobile

## Result

Pass. From the homepage formulations section, each pouch stays fully in the viewport while its benefits and ingredient list scroll.

At 1440×900, with the last benefit centered:

- Core pouch top 94px, bottom 580px, height 486px, position sticky
- Restore pouch top 94px, bottom 580px, same height
- Energy pouch top 94px, bottom 580px, same height

Scrolling into each ingredient list kept that formula’s pouch on screen. On a 390px phone the pouch stays static above the copy and does not cover the benefits.

Screenshot: `/opt/cursor/artifacts/sticky-restore-benefits.png`.
