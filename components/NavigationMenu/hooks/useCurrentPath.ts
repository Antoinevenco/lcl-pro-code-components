import { createContext, useContext, useEffect, useState } from "react"

/**
 * Current pathname, provided once at the nav root so every link can flag
 * itself active without prop-drilling. SSR-safe: starts empty, fills in after
 * mount.
 */
const CurrentPathContext = createContext<string>("")

export const CurrentPathProvider = CurrentPathContext.Provider

export function useCurrentPath(): string {
  const [path, setPath] = useState(() =>
    typeof window === "undefined" ? "" : window.location.pathname,
  )

  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    sync()
    // Catch client-side navigations (back/forward + history.pushState).
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [])

  return path
}

/** Read the provided current path inside any nav subcomponent. */
export function useActivePath(): string {
  return useContext(CurrentPathContext)
}

/** Normalise an href or pathname to a trailing-slash-free slug. */
function toSlug(value: string): string {
  let pathname = value
  try {
    // Absolute URLs (prod/pre-prod domains) → compare the path only, so the
    // active state survives across environments.
    pathname = new URL(value, "http://x").pathname
  } catch {
    /* relative value already a pathname */
  }
  return pathname.replace(/\/+$/, "") || "/"
}

/**
 * True when `href` points at the current page. Ignores domain, query and hash
 * so it matches on both the pre-prod and production hosts. Bare anchors (`#`,
 * empty) never match.
 */
export function isActiveHref(href: string | undefined, currentPath: string): boolean {
  if (!href || href === "#" || href.startsWith("#")) return false
  if (!currentPath) return false
  return toSlug(href) === toSlug(currentPath)
}
