/**
 * Search bridge — the shared contract between any search *trigger* (the
 * standalone <Search> component, the navigation search control) and the global
 * overlay widget (search-widget.js, served from the Portail's /search-api).
 *
 * A trigger never implements the overlay. It (1) ensures the widget script is
 * loaded once on the page, and (2) dispatches a window-level CustomEvent the
 * widget listens for. Window events traverse Shadow DOM boundaries, which makes
 * them the right cross-component channel for Webflow code components.
 *
 * Event: `lcl:open-search`, detail `{ query, source, scope }`:
 *   - query  — "" unless a suggestion pill prefilled the search.
 *   - source — trigger origin (analytics only): "icon" | "hero-bar" |
 *              "hero-pill" | "nav".
 *   - scope  — "portail" | "lclpro": the widget picks the backend (`&site=…`).
 */

export type SearchScope = "portail" | "lclpro"
export type SearchSource = "icon" | "hero-bar" | "hero-pill" | "nav"

export const SEARCH_EVENT = "lcl:open-search"

/** Dispatch the open-search event the global widget listens for. */
export function openSearch(
  query: string,
  source: SearchSource,
  scope: SearchScope,
) {
  window.dispatchEvent(
    new CustomEvent(SEARCH_EVENT, { detail: { query, source, scope } }),
  )
}

/**
 * Inject the global overlay widget <script> once (idempotent across every
 * trigger on the page — guarded by window.__lclSearchWidgetLoaded). The
 * /search-api Worker lives on the Portail, so we target the Portail of the
 * SAME environment as the current site (preprod↔preprod, prod↔prod); an
 * explicit window.LCL_SEARCH_WIDGET_SRC overrides the resolution.
 */
export function ensureSearchWidget(scope: SearchScope) {
  const w = window as unknown as {
    __lclSearchWidgetLoaded?: boolean
    LCL_SEARCH_SCOPE?: string
    LCL_SEARCH_WIDGET_SRC?: string
  }
  if (w.__lclSearchWidgetLoaded) return
  w.__lclSearchWidgetLoaded = true
  w.LCL_SEARCH_SCOPE = scope
  const h = window.location.hostname
  const base =
    h === "lclpro.webflow.io"
      ? "https://portail-entrepreneur.webflow.io" // LCL Pro preprod → Portail preprod
      : h === "professionnel.lcl.fr" || h === "www.professionnel.lcl.fr"
        ? "https://www.entrepreneur.lcl.fr" // LCL Pro prod → Portail prod
        : h === "entrepreneur.lcl.fr" ||
            h === "www.entrepreneur.lcl.fr" ||
            h === "portail-entrepreneur.webflow.io"
          ? "" // Portail → same-origin
          : "https://www.entrepreneur.lcl.fr" // default → Portail prod
  const s = document.createElement("script")
  s.src = w.LCL_SEARCH_WIDGET_SRC ?? `${base}/search-api/search-widget.js`
  s.async = true
  document.head.appendChild(s)
}
