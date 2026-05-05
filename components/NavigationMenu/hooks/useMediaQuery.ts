import { useEffect, useState } from "react"

function read(query: string, fallback: boolean): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return fallback
  return window.matchMedia(query).matches
}

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(() => read(query, defaultValue))

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [query])

  return matches
}
