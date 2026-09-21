# Account

Customers can open the account area to log in and, when authenticated, see orders and subscriptions.

## Sub-features

- `account-login` shows the login surface at `/us/account`.
- `account-subscriptions` is reachable after login at `/us/account/subscriptions`.

## How to get to it (user POV)

- Account link in the header → `/us/account`

## Driving it with browser tools

Preconditions:

- Storefront is up. Do not create or guess production passwords.

- **Open account.** Go to `/us/account`. Login (or dashboard if already signed in) is visible.
- **Proof.** Screenshot `artifacts/qa/account/login.png`.
- **Authenticated paths.** Only if a test user is documented in local env. Otherwise mark subscriptions **blocked** pending credentials.

## Gotchas

- Do not register a random email against production.
- Order transfer URLs are tokenized; skip unless the task is transfer.
