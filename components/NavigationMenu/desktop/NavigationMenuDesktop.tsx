import * as NavMenu from "@radix-ui/react-navigation-menu"
import styles from "../styles"
import { MegaMenuPanel } from "./MegaMenuPanel"
import { Logo } from "../primitives/Logo"
import { ContactIcon, SearchIcon, UserIcon } from "../primitives/icons"
import type { MenuTree, TopBarLink } from "../NavigationMenu.types"

export type NavigationMenuDesktopProps = {
  menu: MenuTree
  topBarLinks: TopBarLink[]
  ctaLabel: string
  ctaHref: string
  showSearch: boolean
  variant: "wide" | "compact"
  logoHref: string
  onMenuOpenChange?: (entryLabel: string | null) => void
}

export function NavigationMenuDesktop({
  menu,
  topBarLinks,
  ctaLabel,
  ctaHref,
  showSearch,
  variant,
  logoHref,
  onMenuOpenChange,
}: NavigationMenuDesktopProps) {
  return (
    <nav aria-label="Main navigation" className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.topBarSection}>
          {topBarLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={styles.topBarLink}
              data-current={l.current ? "true" : undefined}
              aria-current={l.current ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className={styles.topBarSection}>
          <a className={`${styles.topBarLink} ${styles.topBarAccent}`} href="#">
            Découvrir LCL
          </a>
          <a className={`${styles.topBarLink} ${styles.topBarAccent}`} href="#">
            <ContactIcon />
            Nous contacter
          </a>
        </div>
      </div>

      <NavMenu.Root
        delayDuration={120}
        skipDelayDuration={200}
        className={styles.bar}
        onValueChange={(v) => onMenuOpenChange?.(v || null)}
      >
        <a href={logoHref} className={styles.logo} aria-label="LCL Pro home">
          <Logo />
        </a>

        <NavMenu.List className={styles.list}>
          {menu.map((entry) => {
            const hasPanel = !!(entry.sections?.length || entry.tabs?.length)
            return (
              <NavMenu.Item key={entry.label}>
                {hasPanel ? (
                  <>
                    <NavMenu.Trigger className={styles.trigger}>
                      {entry.label}
                    </NavMenu.Trigger>
                    <NavMenu.Content
                      onPointerLeave={(e) => {
                        // Some Webflow slot wrappers (and components rendered into them)
                        // emit pointer events that don't bubble through Radix's DOM
                        // listeners. If the cursor is still visually inside the panel
                        // rect, suppress Radix's auto-close — composeEventHandlers
                        // checks defaultPrevented and skips the internal close.
                        const rect = e.currentTarget.getBoundingClientRect()
                        if (
                          e.clientX >= rect.left &&
                          e.clientX <= rect.right &&
                          e.clientY >= rect.top &&
                          e.clientY <= rect.bottom
                        ) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <MegaMenuPanel entry={entry} />
                    </NavMenu.Content>
                  </>
                ) : (
                  <NavMenu.Link asChild>
                    <a href={entry.href ?? "#"} className={styles.trigger}>
                      {entry.label}
                    </a>
                  </NavMenu.Link>
                )}
              </NavMenu.Item>
            )
          })}
        </NavMenu.List>

        <div className={styles.barTools}>
          {showSearch && variant === "wide" ? (
            <label className={styles.search}>
              <SearchIcon />
              <input type="search" placeholder="Rechercher" aria-label="Rechercher" />
            </label>
          ) : showSearch ? (
            <button
              type="button"
              className={styles.iconButton}
              data-variant="account"
              aria-label="Rechercher"
            >
              <SearchIcon />
            </button>
          ) : null}

          <a className={styles.cta} href={ctaHref}>
            {ctaLabel}
          </a>

          <button
            type="button"
            className={styles.iconButton}
            data-variant="account"
            aria-label="Espace client"
          >
            <UserIcon />
          </button>
        </div>

        <div className={styles.viewportWrap}>
          <NavMenu.Viewport className={styles.viewport} />
        </div>
      </NavMenu.Root>
    </nav>
  )
}

export default NavigationMenuDesktop
