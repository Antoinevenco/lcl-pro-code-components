import type { ReactNode } from "react"
import { NavigationMenuDesktop } from "./desktop/NavigationMenuDesktop"
import { NavigationMenuMobile } from "./mobile/NavigationMenuMobile"
import { useMediaQuery } from "./hooks/useMediaQuery"
import styles from "./styles"
import { CurrentPathProvider, useCurrentPath } from "./hooks/useCurrentPath"
import {
  defaultEspaceClient,
  defaultMenu,
  topBarLinks as defaultTopBarLinks,
} from "./data/menu"
import type {
  EspaceClientConfig,
  MenuTree,
  TopBarLink,
} from "./NavigationMenu.types"

export type NavigationMenuProps = {
  logoHref?: string
  ctaLabel?: string
  ctaHref?: string
  showSearch?: boolean
  /** The 4 footer suggestion pills for the search overlay (nav search trigger). */
  searchSuggestions?: string[]
  menu?: MenuTree
  topBarLinks?: TopBarLink[]
  /** Right-aside content per top-level entry (key = entry.label). */
  asideSlots?: Record<string, ReactNode>
  /** Mid "Nos engagements" column content per top-level entry (key = entry.label). */
  engagementsSlots?: Record<string, ReactNode>
  /** "Espace client" modal/drawer content. Falls back to the LCL Pro defaults. */
  espace?: Partial<EspaceClientConfig>
}

export function NavigationMenu({
  logoHref = "/",
  ctaLabel = "Ouvrir un compte",
  ctaHref = "#",
  showSearch = true,
  searchSuggestions,
  menu = defaultMenu,
  topBarLinks = defaultTopBarLinks,
  asideSlots,
  engagementsSlots,
  espace,
}: NavigationMenuProps) {
  const espaceConfig: EspaceClientConfig = { ...defaultEspaceClient, ...espace }
  const resolvedMenu: MenuTree = (asideSlots || engagementsSlots)
    ? menu.map((entry) => {
        const aside = asideSlots?.[entry.label]
        const engagements = engagementsSlots?.[entry.label]
        if (aside == null && engagements == null) return entry
        return {
          ...entry,
          ...(aside != null ? { aside } : {}),
          ...(engagements != null ? { engagements } : {}),
        }
      })
    : menu
  // Desktop ↔ mobile is decided by CSS (`.mobileOnly` / `.desktopOnly`), not JS:
  // Webflow renders the component to static HTML at publish time (no `window`),
  // so a JS-only media query would bake the desktop tree into the HTML and flash
  // to mobile after hydration. CSS media queries are evaluated on first paint,
  // so the correct layout shows immediately. The wide ↔ compact split is a
  // desktop-only sub-variant and stays on JS — no jarring cross-layout jump.
  const isCompact = useMediaQuery("(max-width: 1279.98px)", false)
  const currentPath = useCurrentPath()

  return (
    <CurrentPathProvider value={currentPath}>
      <div className={styles.mobileOnly}>
        <NavigationMenuMobile
          menu={resolvedMenu}
          topBarLinks={topBarLinks}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          logoHref={logoHref}
          espace={espaceConfig}
        />
      </div>
      <div className={styles.desktopOnly}>
        <NavigationMenuDesktop
          menu={resolvedMenu}
          topBarLinks={topBarLinks}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          showSearch={showSearch}
          searchSuggestions={searchSuggestions}
          variant={isCompact ? "compact" : "wide"}
          logoHref={logoHref}
          espace={espaceConfig}
        />
      </div>
    </CurrentPathProvider>
  )
}

export default NavigationMenu
