# Security review

Focus on storefront/backend web issues: secrets in client bundles, CSRF on mutating routes, open redirects, XSS in user-controlled fields, webhook trust, and checkout amount trust on the server.

Never print `.env` values. Never write exploit PoCs. Report the issue, impact, and a hardening fix only.

Payments: Stripe keys in the storefront must be publishable only. Restricted keys and webhook secrets stay on the backend.
