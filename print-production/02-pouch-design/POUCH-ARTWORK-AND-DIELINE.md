# 02 — Pouch artwork and dieline

## What Proof V9 already states

Header on the proof:

> AURA | FOOTER-REFINED FLAT PROOF V9
> 130 x 160 mm per panel | 260 x 180 mm spread | 5 mm outer bleed | Actual size / 100%
> Green = bleed; blue = trim; red = provisional construction. Guide lines must not print.
> Logos traced from approved reference; 8.5 pt body and nominal barcode retained. Supplier prepress proof required.

Use those figures only as the artwork canvas the current proof was built on. They are not a factory dieline.

| Item | Value on Proof V9 | Notes |
| --- | --- | --- |
| Front panel | 130 x 160 mm | Trim size implied by “per panel” |
| Back panel | 130 x 160 mm | Same |
| Spread | 260 x 180 mm | 20 mm of the height is not explained by 160 mm panels. Confirm whether this includes a top seal, zipper band, or gusset |
| Outer bleed | 5 mm | Green on the proof. Must not be a printed guide on the live file |
| Trim | Blue | Non-printing |
| Construction | Red, marked provisional | Non-printing. Do not treat red rules as seal geometry |
| Body type | 8.5 pt | Held from the previous file |
| View | Flat, actual size | Not a 3D mockup |

## Panels

**Front**

- Gold line-art flower-of-life mark, centered
- Wordmark AURA
- Gold rule under the wordmark
- “Daily Wellness Patch”
- Four gold line icons: Cruelty Free, Vegan, Paraben Free, No Fillers
- “30 PATCHES” at the foot

**Back**

- 01 Peel / 02 Apply / 03 Go
- “Patience is key” callout
- Ingredients
- Patch care
- Safety first
- Store with care
- Distributor block, lot, expiry, barcode

Full approved strings live in `06-packaging-information`. Do not reset type from a mockup.

## What a mockup must not be used for

A studio render does not give zipper height, side-gusset width, bottom gusset, seal widths, hang hole, tear notch, or the eye mark. Request the converter’s official dieline in PDF, with layers named, at 1:1, before the print-ready file is rebuilt.

## Dieline request (send this to the pouch manufacturer)

Please supply the official dieline for the Aura Patch stand-up pouch. Artwork will be rebuilt onto that file. Please include:

- Overall flat width and height, and the filled stand-up size
- Front panel, back panel, and any side or bottom gusset, each dimensioned
- Zipper band: placement, width, and the area that must stay free of ink and varnish
- Top seal, side seals, and bottom seal widths
- Tear notch position and the keep-out zone around it
- Bleed (we are currently carrying 5 mm; confirm or replace)
- Safe margin inside trim and inside each seal
- Eyemark / photocell position and size, if your press needs one
- Varnish-free zone for the zipper and any seal
- Valve, if any (this product spec does not call for a degassing valve)
- Preferred file: PDF, dieline on a spot layer named `DIELINE`, set to overprint off, and not on a printing plate
- The laminate and the print method you will actually run (surface or reverse print)

Until that file arrives, do not add a guessed tear notch or zipper to the artwork.

## Files still to drop in this folder

- `aura-pouch-mockup-vN` — presentation only
- `aura-pouch-print-vN.pdf` — rebuilt on the official dieline
- The manufacturer dieline PDF, unchanged
