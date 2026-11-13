# 07 — Barcode and QR

## Barcode on Proof V9

The proof footer shows a UPC-A-style symbol. Read from the reference image, the human-readable line is:

`1 99874 98742 2`

That is 12 digits: `199874987422`.

The proof header says the **nominal barcode** was retained, and that a supplier prepress proof is still required. Treat this number as unconfirmed.

Printer instruction:

- Do not generate a new random code.
- Do not redraw the bars by hand.
- Either place a barcode file produced from your registered GS1 GTIN, with the quiet zone intact and bars in one solid colour (preferably black on a light ground), or omit the symbol until that GTIN exists.
- Check the scanned code on the physical proof. A screenshot of a barcode is not a scannable master.
- Keep the barcode out of the bleed, the seal, and the zipper.
- Lot and expiry sit beside the symbol (`LOT AP261001`, `EXPIRY 11/2029` on the proof). Those values change per batch. Leave fields; do not embed one lot in the plate unless this run is coded that way on purpose.

## QR

Proof V9 has **no QR code**.

If you add one, point it at a stable URL you control, such as `https://www.getaurapatch.com`, and export the QR as vector from that exact URL. Do not place a QR and a barcode so close that either quiet zone is lost. A QR is optional for this DTC pouch. It is not a substitute for a retail GTIN where a retailer requires UPC-A or EAN-13.

## Files still to drop in this folder

- `aura-upca.svg` generated from the registered GTIN, or a note that retail barcode is out of scope
- `aura-qr.svg` only if you decide to print one
- A phone-scan photo from the physical proof, filed with the approval checklist
