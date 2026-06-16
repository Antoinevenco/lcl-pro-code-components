import { SearchIcon } from "../NavigationMenu/primitives/icons/SearchIcon"
import styles from "./styles"

/**
 * LCL Search — pure React component (zero `@webflow` imports).
 *
 * A thin search *trigger*. It does NOT implement the overlay; instead it
 * dispatches a window-level CustomEvent that the global `search-widget.js`
 * (deployed separately on professionnel.lcl.fr) listens for and turns into the
 * actual search overlay. Window events traverse Shadow DOM boundaries, which
 * makes them the right cross-component channel for Webflow code components.
 *
 * The event contract is `lcl:open-search` with
 * `detail: { query, source, scope }`:
 *   - `query`  — "" for the bar/icon, or the pill label for a pill click.
 *   - `source` — trigger origin: "icon" | "hero-bar" | "hero-pill" (and "nav"
 *                from the navigation search control, dispatched elsewhere).
 *   - `scope`  — "portail" | "lclpro"; the discriminator the widget uses to
 *                pick the backend (`&site=<scope>`). Kept SEPARATE from
 *                `source` on purpose.
 */

export type SearchScope = "portail" | "lclpro"
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
}

/** Trigger origin reported to the widget — distinct from `scope`. */
type SearchSource = "icon" | "hero-bar" | "hero-pill"

function dispatchOpen(query: string, source: SearchSource, scope: SearchScope) {
  window.dispatchEvent(
    new CustomEvent("lcl:open-search", {
      detail: { query, source, scope },
    }),
  )
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
}: SearchProps) {
  if (variant === "icon") {
    return (
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Ouvrir la recherche"
        onClick={() => dispatchOpen("", "icon", searchScope)}
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
          onClick={() => dispatchOpen("", "hero-bar", searchScope)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              dispatchOpen("", "hero-bar", searchScope)
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
                onClick={() => dispatchOpen(label, "hero-pill", searchScope)}
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
