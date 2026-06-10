import type { ReactNode } from "react"
import { NavigationMenuDesktop } from "./desktop/NavigationMenuDesktop"
import { NavigationMenuMobile } from "./mobile/NavigationMenuMobile"
import { useMediaQuery } from "./hooks/useMediaQuery"
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
  const isMobile = useMediaQuery("(max-width: 1149.98px)", false)
  const isCompact = useMediaQuery("(max-width: 1279.98px)", false)

  const layout: "desktop" | "compact" | "mobile" = isMobile ? "mobile" : isCompact ? "compact" : "desktop"

  if (layout === "mobile") {
    return (
      <NavigationMenuMobile
        menu={resolvedMenu}
        topBarLinks={topBarLinks}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        logoHref={logoHref}
        espace={espaceConfig}
      />
    )
  }

  return (
    <NavigationMenuDesktop
      menu={resolvedMenu}
      topBarLinks={topBarLinks}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
      showSearch={showSearch}
      variant={layout === "compact" ? "compact" : "wide"}
      logoHref={logoHref}
      espace={espaceConfig}
    />
  )
}

export default NavigationMenu
