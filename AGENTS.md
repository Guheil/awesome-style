# Agent Instructions

Read this file before making any code changes in this project. These rules are mandatory for all future page revamps, section edits, styling passes, and content updates.

## Primary Rule: Preserve Approved Text

- Do not add, remove, rewrite, paraphrase, shorten, expand, or reorder visible website text unless the user explicitly asks for copy changes.
- The original website screenshots and existing page content are SEO-approved. Treat that text as locked.
- If rebuilding a page from a screenshot or source page, preserve the same headings, paragraphs, labels, button text, FAQ text, review text, card text, and navigation text.
- Design work should change layout, spacing, imagery, styling, responsiveness, animation, and presentation only.
- If text appears wrong, duplicated, outdated, or awkward, ask before changing it.

## Visual Direction

The site should feel like a minimalist luxury beachfront hotel brand:

- Elegant, calm, refined, and premium.
- Cohesive across every page and section.
- Consistent with the home page theme, spacing, typography, buttons, navigation, footer, and section rhythm.
- Luxurious without looking busy, ornamental, or cluttered.
- Simple compositions with strong alignment, generous spacing, restrained detail, and polished imagery.
- Avoid messy decorative elements, random visual effects, and one-off styles that do not match the rest of the site.

## Color Palette

Use the existing CSS custom properties from `src/assets/css/main.css` as the source of truth:

```css
--gold: #b58a54;
--gold-bright: #d7b47a;
--gold-pale: #f3e2bd;
--gold-dim: rgba(181, 138, 84, 0.26);
--navy: #2f2418;
--navy-mid: #5d4936;
--ivory: #fbf5ea;
--ivory-dim: rgba(251, 245, 234, 0.72);
--white: #ffffff;
--glass-bg: rgba(255, 250, 242, 0.82);
--glass-border: rgba(174, 140, 94, 0.24);
--sand: #f2eadc;
--champagne: #efe1c6;
--latte: #d9c3a2;
--taupe: #8b7458;
--ink: #37291d;
```

- Prefer these variables over hardcoded colors.
- If a new color is truly needed, add it to `:root` first and make sure it supports the existing palette.
- Use gold as an accent, not as a large dominant fill.
- Use ivory, white, sand, champagne, navy, and ink for page structure and readable contrast.
- Avoid gradients unless the user explicitly requests one. The current design preference is solid, elegant surfaces.

## Typography

- Follow the established pairing already used by the site.
- Use `Cormorant Garamond` for elegant display headings and editorial moments.
- Use `Jost` for navigation, body text, labels, controls, and supporting copy.
- Keep headings refined and readable. Do not use oversized type inside compact cards or panels.
- Do not introduce unrelated font families unless the user explicitly asks for a new brand direction.

## Layout Principles

- Keep pages visually connected to the home page.
- Use full-width page sections or clean constrained layouts.
- Avoid styling entire page sections as floating cards.
- Use cards only for repeated items, testimonials, event cards, room cards, or similar content groups.
- Keep alignment intentional. Avoid large accidental empty spaces.
- When using two-column sections, balance the columns with imagery, spacing, or non-text visual structure while keeping the approved text unchanged.
- Alternate layouts only when it improves flow and consistency.
- Keep imagery polished, relevant to the hotel, beachfront, events, rooms, dining, or amenities.

## Responsiveness

- Every page and section must be mobile ready.
- Test or reason through desktop, tablet, and mobile layouts before finishing.
- Ensure text does not overlap, overflow, or become too small to read.
- Ensure carousels, accordions, nav menus, buttons, and cards remain usable on touch devices.
- Collapse multi-column layouts cleanly to one column on smaller screens.
- Keep hero sections strong on desktop while still showing a hint of the next section on mobile where practical.

## Interaction Rules

- Interactive elements should feel smooth, calm, and reliable.
- Dropdowns and menus must be easy to hover, focus, and click.
- Carousels must expose clear controls and work without layout jumps.
- Accordions should open smoothly and use readable text weight.
- Avoid unnecessary animations. Use motion only when it improves clarity or polish.

## Page Revamp Workflow

Before editing code:

1. Read this file.
2. Inspect the relevant existing HTML, CSS, and JavaScript.
3. Identify the approved text and preserve it exactly.
4. Reuse existing classes, tokens, components, and page patterns where practical.
5. Make focused edits only to the requested page or section.
6. Verify syntax after JavaScript changes with `node --check src/assets/js/main.js`.
7. If possible, visually inspect the page in a browser or clearly state if no live preview was run.

## Do Not

- Do not rewrite SEO-approved text for style, grammar, or brevity.
- Do not add filler marketing copy to solve layout problems.
- Do not introduce gradients, noisy backgrounds, blobs, or random decorative shapes without explicit approval.
- Do not create a new visual language for one page.
- Do not use hardcoded colors when an existing root variable fits.
- Do not sacrifice mobile readability for desktop composition.
- Do not remove existing user changes unless the user explicitly asks.

