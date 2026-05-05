import { NavigationMenuDesktop } from "./desktop/NavigationMenuDesktop"
import { NavigationMenuMobile } from "./mobile/NavigationMenuMobile"
import { useMediaQuery } from "./hooks/useMediaQuery"
import { defaultMenu, topBarLinks as defaultTopBarLinks } from "./data/menu"
import type { MenuTree, TopBarLink } from "./NavigationMenu.types"

export type NavigationMenuProps = {
  logoHref?: string
  ctaLabel?: string
  ctaHref?: string
  showSearch?: boolean
  menu?: MenuTree
  topBarLinks?: TopBarLink[]
  /** Right-aside content per top-level entry (key = entry.label). */
  asideSlots?: Record<string, React.ReactNode>
}

export function NavigationMenu({
  logoHref = "/",
  ctaLabel = "Ouvrir un compte",
  ctaHref = "#",
  showSearch = true,
  menu = defaultMenu,
  topBarLinks = defaultTopBarLinks,
  asideSlots,
}: NavigationMenuProps) {
  const resolvedMenu: MenuTree = asideSlots
    ? menu.map((entry) =>
        asideSlots[entry.label] != null ? { ...entry, aside: asideSlots[entry.label] } : entry,
      )
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
    />
  )
}

export default NavigationMenu
