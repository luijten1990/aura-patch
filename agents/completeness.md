# Completeness review

Assume the website is incomplete. Search for TODO, FIXME, placeholder, lorem ipsum, mock data, console.log, coming soon, example.com, dummy, and test content.

Also inspect broken links, missing images/alt, buttons without actions, forms without validation, missing 404, missing loading/empty states.

`npm run qa:scan` lists candidates; they are not confirmed bugs. Fix only what is safe and real. Leave seed/test fixtures that are not production UI.
