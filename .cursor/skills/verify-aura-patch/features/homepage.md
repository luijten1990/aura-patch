# Homepage and navigation

The homepage explains Aura Core and lets a shopper reach Shop, Collection, Ingredients, Science, FAQ, and the cart.

## Sub-features

- `home-hero` shows the Aura Core story and Shop Aura Core.
- `home-nav` reaches Shop and Home from the header.
- `home-mobile` exposes links from the side menu under ~768px.

## How to get to it (user POV)

- Open `http://localhost:8000/us`
- Choose Home or the AURA PATCH mark
- Choose Shop in the header (desktop) or side menu (mobile)

## Driving it with browser tools

Preconditions:

- Doctor passed for the storefront.
- Viewport 1280px for desktop, 375px for mobile.

- **Load home.** Open `/us`. Heading and `Shop Aura Core` are visible. Screenshot `artifacts/qa/homepage/desktop.png`.
- **Shop from nav.** Click `Shop`. URL includes `/store`. Catalog or product cards render.
- **Logo home.** Click `data-testid="nav-store-link"`. Return to `/us`.
- **Mobile menu.** 375px viewport, open the side menu, confirm Shop/Home. Screenshot `artifacts/qa/homepage/mobile.png`.

## Gotchas

- Routes are country-prefixed; `/` may redirect to `/us`.
- If the backend is down, the hero may still render while catalog sections fail. Record that split; do not mark Shop verified.
