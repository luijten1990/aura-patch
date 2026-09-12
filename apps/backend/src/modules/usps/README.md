# USPS labels

This provider creates a USPS domestic PDF label automatically when a Medusa administrator creates an order fulfillment. It returns and stores the tracking number and a PDF data URL on the fulfillment; no USPS secret is exposed to the storefront.

## Set up

1. Enroll the USPS business account in USPS Ship, enable the Labels API, and create an Enterprise Payment Account.
2. Fill in the USPS values in `.env` from `.env.template`. Keep `USPS_API_BASE_URL=https://apis-tem.usps.com` for the first test; TEM labels are watermarked and do not charge postage.
3. In Medusa Admin, add **USPS** to the US warehouse's fulfillment providers and create US shipping options with provider `fp_usps_usps` / fulfillment option `usps-domestic`.
4. Create a fulfillment for a paid test order. Medusa will create the label, display its tracking number, and retain the PDF against the fulfillment.
5. Change the base URL to `https://apis.usps.com` only after the USPS test succeeds.

The provider uses one fixed parcel profile from `USPS_DEFAULT_*`. Measure the packed shipment and set those values before going live. It intentionally only supports domestic labels: the existing USPS international label workflow has customs requirements and should be added as a separate reviewed flow.

## Emailing labels to the fulfillment inbox

Set `BREVO_API_KEY` and a sender email already verified in Brevo as `BREVO_SENDER_EMAIL`. Every successful label creation then emails its PDF attachment to `USPS_LABEL_EMAIL_TO`, which defaults to `orders@getaurapatch.com`. A Brevo delivery failure is logged but never fails the fulfillment after USPS has already purchased a label; this avoids accidentally purchasing duplicate labels during a retry.

USPS labels cannot be treated as automatically refunded when a Medusa fulfillment is canceled. Process voids/refunds through USPS according to its label-refund process.
