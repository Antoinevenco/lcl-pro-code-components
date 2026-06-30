import { useEffect } from "react"
import { SearchIcon } from "../NavigationMenu/primitives/icons/SearchIcon"
import { ensureSearchWidget, openSearch } from "./bridge"
import type { SearchScope } from "./bridge"
import styles from "./styles"

/**
 * LCL Search — pure React component (zero `@webflow` imports).
 *
 * A thin search *trigger*. It does NOT implement the overlay; it dispatches the
 * `lcl:open-search` window event (via ./bridge) that the global
 * `search-widget.js` turns into the actual overlay, and auto-loads that widget
 * on mount. The same bridge backs the navigation search control, so the event
 * contract and the env-aware widget URL live in one place.
 *
 * Three variants:
 *   - "bar-pills" — full search bar + suggestion pills (used on the Portail hero)
 *   - "bar"       — search bar only (no pills)
 *   - "icon"      — compact loupe button (used in the nav)
 *
 * Scope drives BOTH the backend (`portail` | `lclpro`) AND the visual theme:
 *   - portail → dark theme, hard-coded values that reproduce the widget's
 *     `.lcl-hero-search` look (so it renders correctly on the Portail, whose
 *     pages do NOT ship the LCL Pro `--_…` design tokens).
 *   - lclpro  → light theme driven by the LCL Pro tokens (see Search.module.css).
 * The theme is selected via `data-scope` on the rendered element; the CSS owns
 * the actual styling. Content defaults (placeholder / pills / footer
 * suggestions) also follow the scope unless the designer overrides them.
 */

export type { SearchScope }
export type SearchVariant = "bar-pills" | "bar" | "icon"

/** Per-scope content defaults. Mirror the widget's own scope config
 *  (src/widget/search-widget.js → SCOPES) so the trigger and the overlay agree.
 *  Empty props fall back to these; non-empty props always win. */
const SCOPE_DEFAULTS: Record<
  SearchScope,
  { placeholder: string; pills: string[]; suggestions: string[] }
> = {
  portail: {
    placeholder: "Rechercher un outil, un guide, un article…",
    pills: [
      "Business plan",
      "Créer mon entreprise",
      "Financement",
      "Comptabilité",
      "Salariés",
      "Simuler un prêt",
    ],
    suggestions: ["financement", "comptabilité", "TPE", "simuler un prêt"],
  },
  lclpro: {
    placeholder: "Rechercher un produit, un service…",
    pills: [
      "Compte pro",
      "Carte Business",
      "Financement",
      "Assurance pro",
      "Encaissement",
      "Trésorerie",
    ],
    suggestions: ["compte pro", "affacturage", "monem", "assurance"],
  },
}

export type SearchProps = {
  /** Which backend the widget should query AND which visual theme to apply. */
  searchScope?: SearchScope
  /** "bar-pills" (bar + pills), "bar" (bar only), or "icon" (compact button). */
  variant?: SearchVariant
  /** Placeholder for the bar. Empty → scope default. */
  placeholder?: string
  pill1?: string
  pill2?: string
  pill3?: string
  pill4?: string
  pill5?: string
  pill6?: string
  /** Footer suggestion pills shown at the bottom of the overlay. Empty → scope default. */
  suggestion1?: string
  suggestion2?: string
  suggestion3?: string
  suggestion4?: string
}

const clean = (s?: string) => (s || "").trim()

export function Search({
  searchScope = "lclpro",
  variant = "icon",
  placeholder = "",
  pill1 = "",
  pill2 = "",
  pill3 = "",
  pill4 = "",
  pill5 = "",
  pill6 = "",
  suggestion1 = "",
  suggestion2 = "",
  suggestion3 = "",
  suggestion4 = "",
}: SearchProps) {
  const scopeDef = SCOPE_DEFAULTS[searchScope] ?? SCOPE_DEFAULTS.lclpro

  // Empty → scope default, non-empty → designer override.
  const customPills = [pill1, pill2, pill3, pill4, pill5, pill6]
    .map(clean)
    .filter(Boolean)
  const pills = customPills.length ? customPills : scopeDef.pills

  const resolvedPlaceholder = clean(placeholder) || scopeDef.placeholder

  // Auto-load the global overlay widget once — dropping this component is
  // enough, no per-page <script> needed (guarded against double-load inside
  // ensureSearchWidget). LCL_SEARCH_SCOPE sets the page's default scope, and the
  // resolved footer suggestions feed the overlay via window.LCL_SEARCH_FOOTER.
  // The footer is recomputed inside the effect (from the primitive inputs +
  // scope) so the dependency array stays exhaustive without a derived array.
  useEffect(() => {
    const custom = [suggestion1, suggestion2, suggestion3, suggestion4]
      .map(clean)
      .filter(Boolean)
    const footer = custom.length
      ? custom
      : (SCOPE_DEFAULTS[searchScope] ?? SCOPE_DEFAULTS.lclpro).suggestions
    ensureSearchWidget(searchScope, footer)
  }, [searchScope, suggestion1, suggestion2, suggestion3, suggestion4])

  if (variant === "icon") {
    return (
      <button
        type="button"
        data-scope={searchScope}
        className={styles.iconButton}
        aria-label="Ouvrir la recherche"
        onClick={() => openSearch("", "icon", searchScope)}
      >
        <SearchIcon title="Rechercher" />
      </button>
    )
  }

  const showPills = variant === "bar-pills" && pills.length > 0

  return (
    <div className={styles.root} data-scope={searchScope}>
      <div className={styles.heroWrap}>
        <div
          role="button"
          tabIndex={0}
          className={styles.heroBar}
          aria-label="Ouvrir la recherche"
          onClick={() => openSearch("", "hero-bar", searchScope)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              openSearch("", "hero-bar", searchScope)
            }
          }}
        >
          <SearchIcon />
          <span className={styles.heroPlaceholder}>{resolvedPlaceholder}</span>
        </div>

        {showPills ? (
          <div className={styles.pills} role="group" aria-label="Suggestions">
            {pills.map((label, i) => (
              <button
                key={`${i}-${label}`}
                type="button"
                className={styles.pill}
                onClick={() => openSearch(label, "hero-pill", searchScope)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Search
