# Design System Review

Inspect the entire project for visual inconsistencies.

Identify the actual design tokens currently being used:

- colors
- typography
- font sizes
- font weights
- spacing
- border radius
- shadows
- buttons
- inputs
- cards
- containers

Then identify inconsistencies.

For example:

Button A: border-radius 8px

Button B: border-radius 14px

Button C: border-radius 999px

Determine whether these differences are intentional.

Do not normalize intentional differences (Subscribe vs one-time treatments, filled vs outline CTAs).

Where inconsistencies are accidental, refactor toward reusable design tokens/components.

Do not redesign the site without evidence from the existing design direction (forest, cream, wine, gold).
