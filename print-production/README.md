# Aura Patch — Print Production Package

Send this folder to the pouch converter and the sticker printer together. It records what is already approved on the current proofs, what is still missing, and what must not be invented at prepress.

This package was built from two reference images already in hand:

- `04-pouch-proof/footer-refined-flat-proof-v9-reference.png` — *AURA | FOOTER-REFINED FLAT PROOF V9*
- `03-patch-stickers/round-patch-sticker-print-guide-reference.png` — round 40 mm sticker print guide

Those images are flattened references. They are not press files. The Google Drive folder `1N6YmjX5-LXwVm6sGw_LBc4uG7OBXj_oA` could not be read from this workspace, so native PDFs, vectors, and the ingredient-list source file still need to be dropped into the matching folders below.

## Folder map

| Folder | What belongs here | Status |
| --- | --- | --- |
| `01-ingredient-list` | Final ingredient declaration for the pouch | Drafted from Proof V9. Conflicts with the website list. Do not print until reconciled. |
| `02-pouch-design` | Mockup, print artwork, manufacturer dieline | Dimensions taken from Proof V9. Official dieline is still required. |
| `03-patch-stickers` | Sticker artwork and cutting spec | Spec drafted from the print guide. Press PDF still required. |
| `04-pouch-proof` | Manufacturer proof and the approved version | Proof V9 recorded. Not signed off. |
| `05-brand-guidelines` | Logo, fonts, colour, finish | Finish and exact ink values still open. No Pantone invented. |
| `06-packaging-information` | Directions, warnings, net contents, distributor | Transcribed from Proof V9. Regulatory review still required. |
| `07-barcode-qr` | Retail barcode, QR, lot space | Barcode on the proof is nominal. Do not treat it as a registered GTIN. |
| `08-print-specifications` | Materials, dimensions, finishes | Pouch and sticker specs, with open items called out. |
| `09-final-print-approval` | One-page sign-off | Blank checklist. Do not start a production run from this package yet. |

## Three versions of every design

Keep these apart. A file that looks right on screen can still be wrong on press.

1. **Mockup.** Presentation only. Marketing, investors, the website. May be RGB, cropped, or photographed.
2. **Print-ready.** Actual size, CMYK, bleed, vector logo and rules, fonts outlined or supplied, dieline on a non-printing layer.
3. **Proof.** The supplier’s final rendering, with their legend. Proof V9 is this version for the pouch. Approve a physical drawdown before the production quantity.

Name files `aura-<item>-mockup-vN`, `aura-<item>-print-vN`, or `aura-<item>-proof-vN`, and put the date in the approval checklist when a version is signed.

## Stop-print items

Resolve these before anyone plates or orders laminate:

1. The website formula in `apps/storefront/src/lib/data/aura-collection.ts` is not the same list as Proof V9. See `01-ingredient-list`.
2. The proof barcode is marked nominal. Confirm the real GS1 GTIN or leave the barcode off.
3. There is no manufacturer dieline. Seal, zipper, gusset, and tear notch are unknown.
4. Gold on the sticker is specified as foil **or** metallic ink. Pick one process.
5. Copy on the pouch needs a regulatory check for the markets you will ship into. This folder does not replace that review.
