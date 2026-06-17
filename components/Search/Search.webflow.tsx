import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import Search from "./Search"
import type { SearchScope, SearchVariant } from "./Search"

/**
 * Webflow passes Text props as plain strings and Variant props as their union
 * literal. This hand-written type mirrors that wire shape; it intentionally
 * differs from the pure `SearchProps` (whose fields are optional with defaults).
 */
type WebflowProps = {
  searchScope: SearchScope
  variant: SearchVariant
  placeholder: string
  pill1: string
  pill2: string
  pill3: string
  pill4: string
  pill5: string
  pill6: string
}

// This file pairs a wrapper component with a `declareComponent(...)` default
// export (the Webflow binding), so the file legitimately has a non-component
// export. react-refresh/only-export-components is disabled for *.webflow.tsx
// in eslint.config.js (Fast Refresh doesn't apply to the Webflow build).
function SearchWebflow({
  searchScope,
  variant,
  placeholder,
  pill1,
  pill2,
  pill3,
  pill4,
  pill5,
  pill6,
}: WebflowProps) {
  return (
    <Search
      searchScope={searchScope}
      variant={variant}
      placeholder={placeholder}
      pill1={pill1}
      pill2={pill2}
      pill3={pill3}
      pill4={pill4}
      pill5={pill5}
      pill6={pill6}
    />
  )
}

export default declareComponent(SearchWebflow, {
  name: "LCL Search",
  description:
    "LCL Pro search trigger. Icon button (default) or hero bar + suggestion pills. Dispatches a 'lcl:open-search' window event that the global search-widget.js turns into the search overlay. Does not implement the overlay itself.",
  group: "LCL",
  props: {
    searchScope: props.Variant({
      name: "Search source",
      options: ["portail", "lclpro"],
      defaultValue: "lclpro",
    }),
    variant: props.Variant({
      name: "Variant",
      options: ["hero", "icon"],
      defaultValue: "icon",
    }),
    placeholder: props.Text({
      name: "Placeholder (hero)",
      defaultValue: "Rechercher un produit, un service…",
    }),
    pill1: props.Text({ name: "Pill 1 (hero)", defaultValue: "Compte pro" }),
    pill2: props.Text({ name: "Pill 2 (hero)", defaultValue: "Carte Business" }),
    pill3: props.Text({ name: "Pill 3 (hero)", defaultValue: "Financement" }),
    pill4: props.Text({ name: "Pill 4 (hero)", defaultValue: "Assurance pro" }),
    pill5: props.Text({ name: "Pill 5 — optional (hero)", defaultValue: "" }),
    pill6: props.Text({ name: "Pill 6 — optional (hero)", defaultValue: "" }),
  },
  options: {
    // Browser-only: the component dispatches a window CustomEvent on click,
    // so SSR would crash or produce dead HTML. ssr:false is mandatory.
    ssr: false,
  },
})
