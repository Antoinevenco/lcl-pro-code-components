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
 */

export type { SearchScope }
export type SearchVariant = "hero" | "icon"

export type SearchProps = {
  /** Which backend the widget should query. */
  searchScope?: SearchScope
  /** "icon" (compact button, default) or "hero" (full bar + pills). */
  variant?: SearchVariant
  /** Placeholder shown inside the hero bar. */
  placeholder?: string
  pill1?: string
  pill2?: string
  pill3?: string
  pill4?: string
  pill5?: string
  pill6?: string
  /** The 4 footer suggestion pills shown at the bottom of the search overlay. */
  suggestion1?: string
  suggestion2?: string
  suggestion3?: string
  suggestion4?: string
}

export function Search({
  searchScope = "lclpro",
  variant = "icon",
  placeholder = "Rechercher un produit, un service…",
  pill1 = "Compte pro",
  pill2 = "Carte Business",
  pill3 = "Financement",
  pill4 = "Assurance pro",
  pill5 = "",
  pill6 = "",
  suggestion1 = "Compte pro",
  suggestion2 = "Affacturage",
  suggestion3 = "Monem",
  suggestion4 = "Assurance",
}: SearchProps) {
  // Auto-load the global overlay widget once — dropping this component is
  // enough, no per-page <script> needed (guarded against double-load inside
  // ensureSearchWidget). LCL_SEARCH_SCOPE sets the page's default scope, and the
  // 4 suggestions feed the overlay footer via window.LCL_SEARCH_FOOTER.
  useEffect(() => {
    const footer = [suggestion1, suggestion2, suggestion3, suggestion4]
      .map((s) => (s || "").trim())
      .filter(Boolean)
    ensureSearchWidget(searchScope, footer)
  }, [searchScope, suggestion1, suggestion2, suggestion3, suggestion4])

  if (variant === "icon") {
    return (
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Ouvrir la recherche"
        onClick={() => openSearch("", "icon", searchScope)}
      >
        <SearchIcon title="Rechercher" />
      </button>
    )
  }

  const pills = [pill1, pill2, pill3, pill4, pill5, pill6]
    .map((s) => (s || "").trim())
    .filter(Boolean)

  return (
    <div className={styles.root}>
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
          <span className={styles.heroPlaceholder}>{placeholder}</span>
        </div>

        {pills.length > 0 ? (
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
