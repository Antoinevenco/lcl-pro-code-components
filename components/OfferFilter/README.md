# OfferFilter

A Webflow code component that replaces the "chips" filter for the LCL Pro
offer comparison. Renders a card with the existing form dropdown + a primary
CTA, and drives the visibility of an *outside* DOM (a comparison table and a
set of offer cards) on mobile.

## What it controls (outside DOM contract)

The page is expected to contain — outside this component — markup that opts
into the following conventions:

- **Table cells:** `<… class="offer-table-cell_wrap">`. Each cell that belongs
  to a specific offer column also carries the class `{value}-offer` (e.g.
  `lbylcl-offer`). Cells that must never be hidden carry either `header` or
  `common`.
- **Offer cards:** `<… data-filter-card="{value}">`.

Breakpoint:

- **Desktop** (`min-width: 480px`): all cards and columns stay visible. The
  dropdown is a visual title only — it clears any inline `display` the
  component previously set so the site's own CSS wins.
- **Compact** (`max-width: 479px`): selecting `V` shows only the card whose
  `data-filter-card="V"`, hides every other `[data-filter-card]`, and hides
  every `offer-table-cell_wrap` that does not carry `header`, `common`, or
  `{V}-offer`.

The selectors, the `{value}-offer` suffix, the always-visible class list,
and the breakpoint live as named constants at the top of `OfferFilter.tsx`
so changing them is one edit.

## Reused parts (not reinvented)

- **Dropdown:** `Form/primitives/SelectField` (Radix Select under the hood)
  is composed directly — no new dropdown, no reimplemented open/close, ESC,
  or keyboard handling. To match the Figma card-selection visual,
  `SelectField` was extended (backward-compatibly) with three optional
  class-override props — `triggerClassName`, `iconClassName`,
  `contentClassName` — and an `ariaLabel` fallback for when no visible
  `<label>` is wired. Existing callers that don't pass them keep the same
  styling.
- **Design tokens:** every color, spacing, radius, and font value resolves
  to a `var(--_…)` token from `/reference code/variables.css`. No tokens
  were invented. The Figma's 20 px title was mapped to `--_typography---font-size--h3`
  (the closest available scale step); 42 px / 34 px / 40 px / 24 px sizing
  values are kept in `rem` and flagged in the CSS where they don't snap to
  a token.

## SSR / Shadow DOM notes

- The Webflow binding registers the component with `options.ssr = false`.
  All `document` / `window.matchMedia` access happens inside `useEffect`,
  so a Storybook/Next harness that does run SSR would also stay safe.
- The Radix `Portal` is pinned to the component root so the dropdown menu
  stays inside the Shadow DOM where the stylesheet lives — same workaround
  used by the `Form` component.
- On unmount the effect clears every inline `display` it set, so a remount
  (or HMR) doesn't inherit stale hidden cells.

## Multi-instance

This component assumes a single instance per page. If the page ends up with
multiple instances, both will write to the same outside elements; the last
`change` wins and inline `display` values stay consistent because every run
reapplies from scratch. The brief endorses a `window` CustomEvent (`offer:change`)
with a single listener as the way to coordinate — not wired in v1.

## Files

```
OfferFilter.tsx          Pure React: state + outside-DOM effect + composition
OfferFilter.webflow.tsx  Webflow binding (declareComponent + props)
OfferFilter.types.ts     Offer type
OfferFilter.module.css   Token-driven styles
styles.ts                CSS-module bridge (webpack/Vite parity)
```

## Designer props

| Prop                     | Type   | Purpose                                       |
| ------------------------ | ------ | --------------------------------------------- |
| `offer{1..4}Title/Value` | Text   | Up to 4 offers. Empty title disables a slot.  |
| `defaultValue`           | Text   | Slug of the initial mobile selection.         |
| `ctaLabel`               | Text   | Primary CTA label.                            |
| `ctaLink`                | Link   | Primary CTA href + target.                    |
| `imageSrc`               | Image  | Optional card-top illustration.               |

There's no `Array`/JSON prop type in `@webflow/data-types`, so offers are
exposed as a fixed set of Text pairs rather than a single structured prop.
