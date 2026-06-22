import * as NavMenu from "@radix-ui/react-navigation-menu"
import { useEffect, useRef } from "react"
import { CtaButton } from "../../primitives/CtaButton"
import { ensureSearchWidget, openSearch } from "../../Search/bridge"
import type {
  EspaceClientConfig,
  MenuTree,
  TopBarLink,
} from "../NavigationMenu.types"
import { isActiveHref, useActivePath } from "../hooks/useCurrentPath"
import { EspaceClientModal } from "../primitives/EspaceClientModal"
import { Logo } from "../primitives/Logo"
import { ContactIcon, SearchIcon } from "../primitives/icons"
import styles from "../styles"
import { MegaMenuPanel } from "./MegaMenuPanel"

export type NavigationMenuDesktopProps = {
  menu: MenuTree
  topBarLinks: TopBarLink[]
  ctaLabel: string
  ctaHref: string
  showSearch: boolean
  /** Footer suggestion pills for the search overlay (fed to the shared widget). */
  searchSuggestions?: string[]
  variant: "wide" | "compact"
  logoHref: string
  espace: EspaceClientConfig
  onMenuOpenChange?: (entryLabel: string | null) => void
}

export function NavigationMenuDesktop({
  menu,
  topBarLinks,
  ctaLabel,
  ctaHref,
  showSearch,
  searchSuggestions,
  logoHref,
  espace,
  onMenuOpenChange,
}: NavigationMenuDesktopProps) {
  const currentPath = useActivePath()
  const navRef = useRef<HTMLElement>(null)

  // The nav search control is a trigger for the shared overlay widget (same
  // contract as the standalone <Search> component). Auto-load the widget when
  // search is shown so a click opens instantly; idempotent across triggers.
  useEffect(() => {
    if (showSearch) ensureSearchWidget("lclpro", searchSuggestions)
  }, [showSearch, searchSuggestions])

  // Webflow renders code components as web components with Shadow DOM, and slot
  // content (the designer's card components) lives in the host's *light* DOM,
  // projected into the panel via a native <slot>. Radix's DismissableLayer
  // lives in the shadow tree and detects "outside" clicks via React event
  // propagation, which never reaches it from light-DOM nodes — so a click on a
  // slotted card looks like an outside click and closes the menu on pointerdown,
  // unmounting the <slot> before the click can navigate. Slotted content is
  // always a descendant of the shadow host, so when an outside interaction's
  // target is inside the host we keep the menu open (preventDefault) and let the
  // native navigation run. No-op in the local non-shadow preview.
  const keepOpenForSlottedContent = (
    event: CustomEvent<{ originalEvent: Event }>,
  ) => {
    const root = navRef.current?.getRootNode()
    const host = root instanceof ShadowRoot ? root.host : null
    const target = event.target as Node | null
    if (host && target && host.contains(target)) event.preventDefault()
  }

  return (
    <nav ref={navRef} aria-label="Main navigation" className={styles.root}>
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
          {/* <a className={`${styles.topBarLink} ${styles.topBarAccent}`} href="#">
            Découvrir LCL
          </a> */}
          <a
            className={`${styles.topBarLink} ${styles.topBarAccent}`}
            href="/contacter-lcl-professionnel"
          >
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
                      onInteractOutside={keepOpenForSlottedContent}
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
                  <NavMenu.Link
                    asChild
                    active={isActiveHref(entry.href, currentPath)}
                  >
                    <a
                      href={entry.href ?? "#"}
                      className={styles.trigger}
                      aria-current={
                        isActiveHref(entry.href, currentPath)
                          ? "page"
                          : undefined
                      }
                    >
                      {entry.label}
                    </a>
                  </NavMenu.Link>
                )}
              </NavMenu.Item>
            )
          })}
        </NavMenu.List>

        <div className={styles.barTools}>
          {showSearch ? (
            // Always the loupe icon button (never the search bar): the overlay
            // IS the search field, so the trigger stays a compact button at
            // every width. Dispatches lcl:open-search to the shared widget.
            <button
              type="button"
              className={styles.iconButton}
              data-variant="account"
              aria-label="Rechercher"
              onClick={() => openSearch("", "nav", "lclpro")}
            >
              <SearchIcon />
            </button>
          ) : null}

          <CtaButton href={ctaHref} label={ctaLabel} />

          <EspaceClientModal variant="desktop" config={espace} />
        </div>

        <div className={styles.viewportWrap}>
          <NavMenu.Viewport className={styles.viewport} />
        </div>
      </NavMenu.Root>
    </nav>
  )
}

export default NavigationMenuDesktop
