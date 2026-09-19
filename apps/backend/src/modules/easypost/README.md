# EasyPost checkout and labels

This provider quotes live EasyPost rates during checkout and buys a PDF label when a fulfillment is created. USPS is not used as a direct integration; EasyPost selects a carrier from the connected EasyPost account.

## Set up

1. Create an EasyPost account, add carrier accounts, and copy a test or production API key.
2. Fill in `EASYPOST_*` in `.env` from `.env.template`. Test keys start with `EZTEST`.
3. In Medusa Admin, add **EasyPost** to the warehouse fulfillment providers. A startup job also creates calculated EasyPost shipping options on US and international service zones when it can.
4. Place a test order, then create a fulfillment. The tracking number is stored on the fulfillment and the PDF is emailed to `EASYPOST_LABEL_EMAIL_TO`.

The packed parcel comes from `EASYPOST_PACKAGE_*`. Measure the real shipment before going live. International quotes include customs using `EASYPOST_ITEM_*` and `EASYPOST_CUSTOMS_SIGNER`. Missing warehouse fields can be filled with `EASYPOST_ORIGIN_*`.

A failed quote does not become $0 shipping. Checkout shows the option as unavailable until EasyPost returns a USD rate.
