import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { CtaButton } from "../../primitives/CtaButton"
import type {
  EspaceClientConfig,
  MenuTree,
  TopBarLink,
} from "../NavigationMenu.types"
import { secondaryLinks } from "../data/menu"
import { useMenuStack } from "../hooks/useMenuStack"
import { EspaceClientModal } from "../primitives/EspaceClientModal"
import { Logo } from "../primitives/Logo"
import { CloseIcon, ContactIcon, MenuIcon } from "../primitives/icons"
import styles from "../styles"
import { MenuStackScreen } from "./MenuStackScreen"

export type NavigationMenuMobileProps = {
  menu: MenuTree
  topBarLinks: TopBarLink[]
  ctaLabel: string
  ctaHref: string
  logoHref: string
  espace: EspaceClientConfig
  triggerLabel?: string
}

export function NavigationMenuMobile({
  menu,
  topBarLinks,
  ctaLabel,
  ctaHref,
  logoHref,
  espace,
  triggerLabel = "Menu",
}: NavigationMenuMobileProps) {
  const [open, setOpen] = useState(false)
  // Webflow renders each component inside a Shadow DOM with its own React root.
  // Radix Dialog's Portal defaults to document.body, which lives outside the
  // Shadow DOM — so the CSS module styles never reach the dialog content and
  // it renders as plain inline DOM (visually "open" all the time). Keeping
  // Portal's container inside our component subtree keeps styles in scope.
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  )
  const { current, push, pop, reset } = useMenuStack()

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <nav
        aria-label="Main navigation"
        className={styles.root}
        ref={setPortalContainer}
      >
        <div className={`${styles.bar} ${styles.mobileBar}`}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className={styles.mobileIconButton}
              aria-label={open ? "Fermer le menu" : triggerLabel}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </Dialog.Trigger>

          <a
            href={logoHref}
            className={styles.mobileLogo}
            aria-label="LCL Pro home"
          >
            <Logo />
          </a>

          <EspaceClientModal variant="mobile" config={espace} />
        </div>
      </nav>

      <Dialog.Portal container={portalContainer}>
        <Dialog.Overlay className={styles.mobileOverlay} />
        <Dialog.Content
          className={styles.mobileShell}
          aria-label="Main navigation"
        >
          <Dialog.Title className={styles.srOnly}>Navigation</Dialog.Title>

          <div className={styles.mobileBody}>
            <div className={styles.mobileScreen}>
              {current.kind === "root" ? (
                <MenuStackScreen
                  kind="root"
                  topBarLinks={topBarLinks}
                  menu={menu}
                  secondaryLinks={secondaryLinks}
                  onPushEntry={(entry) => push({ kind: "entry", entry })}
                />
              ) : current.kind === "entry" ? (
                <MenuStackScreen
                  kind="entry"
                  entry={current.entry}
                  onBack={pop}
                  onPushTab={(tab) =>
                    push({ kind: "tab", entry: current.entry, tab })
                  }
                />
              ) : current.kind === "tab" ? (
                <MenuStackScreen
                  kind="tab"
                  entry={current.entry}
                  tab={current.tab}
                  onBack={pop}
                />
              ) : null}
            </div>
          </div>

          <footer className={styles.mobileFooter}>
            <CtaButton href={ctaHref} label={ctaLabel} block />
            <a
              className={styles.topBarLink}
              href="/contacter-lcl-professionnel"
              style={{ color: "var(--_swatch---swatch--brand-blue-600)" }}
            >
              <ContactIcon />
              Nous contacter
            </a>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default NavigationMenuMobile
