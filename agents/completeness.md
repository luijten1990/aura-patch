# Completeness Review

Assume the website is incomplete.

Search the project for:

- TODO
- FIXME
- placeholder
- lorem ipsum
- mock data
- console.log
- temporary
- coming soon
- example.com
- dummy
- test content

`npm run qa:scan` lists candidates. They are not confirmed bugs.

Also inspect for:

- broken links
- missing images
- missing alt text
- missing metadata
- buttons without actions
- forms without validation
- pages without navigation
- routes without error handling
- missing 404 page
- missing loading states
- missing empty states
- missing mobile layouts

Create a prioritized list.

Fix everything that can be safely fixed automatically. Leave seed/test fixtures that are not production UI. "Coming soon" on Restore/Energy may be intentional product status — verify before removing.
