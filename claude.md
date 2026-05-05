# Webflow Code Component — LCL Pro Mega Menu (Navigation Menu)

You are building a production-grade React code component to be imported into Webflow via DevLink (`declareComponent`). The component is the main site navigation for LCL Pro, including a desktop mega menu and a multi-level mobile menu. It must be visually and behaviorally identical to the provided Figma mockups, accessible, and designed to scale to additional menu entries later.

---

## 1. Tech stack & non-negotiables

- **Framework:** React 18 + TypeScript (functional components, hooks, strict mode). Components are wrapped with `declareComponent` from `@webflow/react` so designers can drop them on the Webflow canvas with typed props and slots.
- **Primitives:**
  - `@radix-ui/react-navigation-menu` — desktop bar + mega panel
  - `@radix-ui/react-dialog` — mobile drawer shell (focus trap, scroll lock, ESC)
  - `@radix-ui/react-tabs` — left rail for 3-level entries
  - `framer-motion` — panel open/close and mobile slide transitions
  - `clsx` for conditional classes (upgrade to `cva` once we have real variants)
    All open/close state, focus management, and keyboard nav are delegated to the primitives — do not reimplement.
- **Styling rules — read carefully, this is the most important part of the prompt:**
  1. **Always reach for an existing Webflow CSS variable first.** The full list lives in `/reference code/variables.css`. This means spacing, color, radius, typography sizes, line-heights, and z-indexes should be `var(--wf--…)` tokens, not Tailwind scale values. This keeps the component in sync with the rest of the LCL Pro Webflow site — if a designer retunes a token in Webflow, the component follows.
  2. **Tailwind is the fallback, not the default.** Use Tailwind utilities only for things that have no Webflow variable equivalent: layout primitives (flex, grid, position, display, overflow), state variants (`data-[state=open]:`, `aria-expanded:`, `hover:`, `focus-visible:`), responsive breakpoints, and one-off transforms/transitions.
  3. **When a value would benefit from being a token but no Webflow variable exists yet,** flag it in a comment `/* TODO: add Webflow var --wf--… */` rather than hardcoding. Do not invent magic numbers.
  4. **Prefer raw CSS or inline `style={{}}` over Tailwind when the rule is mostly tokens.** `style={{ paddingInline: 'var(--wf--space--md)', gap: 'var(--wf--space--sm)' }}` is cleaner than `className="px-[var(--wf--space--md)] gap-[var(--wf--space--sm)]"`. Use Tailwind arbitrary-value syntax only when mixed with other utilities.
  5. **Never hardcode colors, spacing, or radii.** If you catch yourself typing `#`, `rem`, or `px` for anything other than a 1px border or sub-pixel transform, stop and look for a token.
- **Accessibility:** WCAG 2.1 AA minimum. Real `<nav>` landmark, correct ARIA from Radix, visible `:focus-visible` states, ESC closes, Tab/Shift+Tab cycles, arrow keys navigate within the menu, body scroll locks when the mobile drawer is open.

---

## 2. File structure — strict convention

Every component lives in `/components/ComponentName/` and contains exactly two top-level files:

- `ComponentName.tsx` — the **pure React implementation**. Knows nothing about Webflow. Could be lifted into Storybook, a Next.js app, or a test harness as-is. Exports the typed component and its prop types.
- `ComponentName.webflow.tsx` — the **Webflow binding**. Imports the React component, wraps it with `declareComponent`, declares prop types via `PropTypes`, and is the only file the Webflow CLI reads.

Supporting files (subcomponents, hooks, data, styles) live in the same folder. No barrel `index.ts` unless we hit a real reason for one.

For this work, the tree is:

/components
/NavigationMenu
NavigationMenu.tsx // root — chooses desktop vs mobile via useMediaQuery
NavigationMenu.webflow.tsx // declareComponent + prop types + slots
NavigationMenu.module.css // token-heavy rules
NavigationMenu.types.ts // shared types (MenuEntry, MenuTab, etc.)
/desktop
NavigationMenuDesktop.tsx // Radix NavigationMenu tree
NavigationMenuDesktop.webflow.tsx
MegaMenuPanel.tsx // 2-level + 3-level (with left tab rail) panel
MegaMenuPanel.webflow.tsx
MenuColumn.tsx
MenuColumn.webflow.tsx
MenuTabRail.tsx // left vertical rail for 3-level entries
MenuTabRail.webflow.tsx
/mobile
NavigationMenuMobile.tsx // Dialog shell + drill-down stack
NavigationMenuMobile.webflow.tsx
MenuStackScreen.tsx // single "screen" in the mobile stack
MenuStackScreen.webflow.tsx
/primitives
MenuItem.tsx
MenuItem.webflow.tsx
/hooks
useMediaQuery.ts
useMenuStack.ts // mobile drill-down state
/data
menu.ts // typed default menu (Comptes et Opérations populated)

Rules:

- **Only `*.webflow.tsx` files import `@webflow/react`.** The `.tsx` files stay framework-agnostic.
- **Only the root `NavigationMenu.webflow.tsx` is exposed to designers.** The subcomponent `.webflow.tsx` files exist so we _can_ expose them later without restructuring, but for v1 they're not registered in the bundle. (Confirm pattern with the Webflow CLI docs and adjust if registration is required for child components.)
- **One component per file.** No co-locating `MenuColumn` inside `MegaMenuPanel.tsx`.
- **Each `.tsx` file exports a default + named export of the same component**, plus a named export of its props type (e.g. `export type NavigationMenuProps`).

---

## 3. Webflow integration via `declareComponent`

In `NavigationMenu.webflow.tsx`:

- Expose **props** for things content editors should control in the Designer: `logoHref`, `ctaLabel`, `ctaHref`, `showSearch: boolean`, etc.
- Expose **slots** for any region a designer might want to override visually: `logo` slot, `cta` slot, `topBanner` slot. Use slots over props whenever the content is markup, not a string.
- Use Webflow's **prop types** (`PropTypes.RichText`, `PropTypes.Link`, `PropTypes.Boolean`, etc. — see https://developers.webflow.com/code-components/reference/prop-types) so the right panel renders proper Webflow controls.
- The menu **data tree** (categories, sections, links) ships as a typed default constant in `data/menu.ts` for v1. Architect it so we can later expose the tree as a slot or wire it to Webflow CMS without rewriting the React components.

Reference: https://developers.webflow.com/code-components/introduction

---

## 4. Menu data shape

Type the tree first, build to the type. Two-level entries (Comptes et Opérations) and three-level entries (Nos savoir-faire, Pour qui ?, Pourquoi LCL ?) share one schema. Lives in `NavigationMenu.types.ts`:

```ts
export type MenuLeaf = {
  label: string
  href: string
  description?: string
  icon?: string
}
export type MenuSection = { label: string; items: MenuLeaf[] } // 2nd-level group
export type MenuTab = { label: string; sections: MenuSection[] } // 3rd-level grouping (left rail on desktop)
export type MenuEntry = {
  label: string
  href?: string
  // Either a flat list of sections (2-level) OR tabs (3-level). Never both.
  sections?: MenuSection[]
  tabs?: MenuTab[]
}
```

For v1, populate **only Comptes et Opérations** fully, from the 1440px Figma. Leave the other three top-level entries as label-only placeholders so I can fill them in later — but the `tabs` branch must already render correctly so the layout is proven end-to-end. Build a small dummy `tabs` example in the preview harness so we can validate the three-level desktop layout (left tab rail + content panel) and the mobile level-2/level-3 stack.

---

## 5. Responsive behavior

Three Figma references — match them pixel-close, but use Webflow tokens for spacing so the result stays in sync:

- **1440px (desktop):** https://www.figma.com/design/sNPG41MbMIolgz2rJodreh/-Marketing--Design-System?node-id=7449-27704
- **1024px (desktop-compact):** https://www.figma.com/design/sNPG41MbMIolgz2rJodreh/-Marketing--Design-System?node-id=7447-26910
- **768px level 0:** https://www.figma.com/design/sNPG41MbMIolgz2rJodreh/-Marketing--Design-System?node-id=7667-46197
- **768px level 1:** https://www.figma.com/design/sNPG41MbMIolgz2rJodreh/-Marketing--Design-System?node-id=7667-46212
- **3-level reference (for tab-rail layout):** https://www.figma.com/design/sNPG41MbMIolgz2rJodreh/-Marketing--Design-System?node-id=7449-27716

**Pull mockups via Figma MCP** (`get_code` / `get_image` on the node IDs above) before writing any markup. If the MCP returns generated React/CSS, treat it as a **layout reference, not source** — rewrite it to use Webflow variables and our component conventions.

Mobile = multi-level drill-down: each tap pushes a new screen onto the stack with a back affordance. `useMenuStack` owns the stack state; `MenuStackScreen` renders one screen; `framer-motion` `AnimatePresence` handles the slide. Lock body scroll while the dialog is open (Radix `Dialog` handles this).

The desktop ↔ mobile switch happens at the breakpoint shown in Figma (likely 1024px). Confirm by inspecting the frames and use the matching Webflow breakpoint token.

---

## 6. Mega menu layout specifics

- **Comptes et Opérations (2-level):** sections rendered as columns inside the panel. Number of columns and column widths come straight from Figma — read off the grid, don't guess.
- **Three-level entries (future, dummy now):** left rail of tab labels, panel on the right showing the active tab's sections. Tabs are vertical on desktop, become an extra navigation level on mobile. Use Radix `Tabs` _inside_ `NavigationMenu.Content`, with arrow-key support and `aria-orientation="vertical"`.
- Panel positioning: anchored under the trigger, full-width container, kept within the site's max-width using the existing Webflow container token.
- Open-on-hover with a small intent delay (~120ms) on desktop, open-on-click on touch. Radix supports both — configure, don't reinvent.

---

## 7. Quality bar / definition of done

- [ ] Local preview route showing: closed top bar, Comptes et Opérations open at 1440 / 1024 / 768, three-level dummy entry open at 1440 / 1024 / 768, mobile drawer at level 0 / 1 / 2 / 3.
- [ ] Zero hardcoded colors, spacing, or radii in shipped code. A `grep` for `#[0-9a-f]`, `rgb(`, and bare `px` values returns only borders/transforms.
- [ ] Every component folder follows the `ComponentName.tsx` + `ComponentName.webflow.tsx` convention. No mixed Webflow imports in `.tsx` files.
- [ ] Keyboard-only walkthrough works: Tab into nav, arrow keys traverse, Enter opens, Esc closes, focus returns to trigger.
- [ ] axe-core / Lighthouse a11y audit passes with no critical issues.
- [ ] No layout shift when the mega menu opens.
- [ ] Component bundles cleanly with the Webflow CLI and imports into a test site without errors.
- [ ] README in `/components/NavigationMenu/` explaining: where tokens come from, the `.tsx` vs `.webflow.tsx` split, how to add a new top-level entry, how to add a third level to an existing entry.

---

## 8. Working agreement

- Read `/reference code/variables.css` end-to-end before writing styles. Keep it open while working.
- Pull the Figma frames listed in §5 first thing. Confirm the breakpoints and the exact token names you'll need before scaffolding.
- Ask before introducing a new dependency. The stack in §1 is the budget; everything else needs justification.
- Ship Comptes et Opérations end-to-end (desktop + mobile, all breakpoints) before broadening. The other three entries land in a follow-up.
- Surface anything where Tailwind genuinely beats a Webflow var + raw CSS approach (or vice versa) — I want the cleanest pattern, not the most familiar one.
