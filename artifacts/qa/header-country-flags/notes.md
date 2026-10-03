# Header country flags

Date: 2026-10-03

Finish condition: the header shipping control shows a small flag next to the selected country and beside every country in the list.

## What was driven

- `next lint` on `apps/storefront/src/modules/layout/components/country-select/index.tsx` passed.
- Local storefront at `http://localhost:8000/us/flag-preview` rendered the same `CountrySelect` used by the header and mobile menu, with the list open.
- Desktop (1100×720) and mobile (390×844) screenshots show a flag on “Shipping to: United States” and on Australia, Canada, France, Germany, Japan, Netherlands, United Kingdom, and United States.
- HTML included a flag image for the selected country and for each option (`cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/{code}.svg`).

## Blocked

The real header list is filled from Medusa regions. This environment has no Medusa backend, so the live nav control stayed empty and the check used the header component with sample countries. The temporary preview route was removed after the screenshots.

Screenshots: `desktop-open.png`, `mobile-open.png`.
