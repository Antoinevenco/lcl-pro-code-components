import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import styles from "../styles"
import { MenuStackScreen } from "./MenuStackScreen"
import { useMenuStack } from "../hooks/useMenuStack"
import { Logo } from "../primitives/Logo"
import type { MenuTree, TopBarLink } from "../NavigationMenu.types"

export type NavigationMenuMobileProps = {
  menu: MenuTree
  topBarLinks: TopBarLink[]
  ctaLabel: string
  ctaHref: string
  logoHref: string
  triggerLabel?: string
}

export function NavigationMenuMobile({
  menu,
  topBarLinks,
  ctaLabel,
  ctaHref,
  logoHref,
  triggerLabel = "Menu",
}: NavigationMenuMobileProps) {
  const [open, setOpen] = useState(false)
  // Webflow renders each component inside a Shadow DOM with its own React root.
  // Radix Dialog's Portal defaults to document.body, which lives outside the
  // Shadow DOM — so the CSS module styles never reach the dialog content and
  // it renders as plain inline DOM (visually "open" all the time). Keeping
  // Portal's container inside our component subtree keeps styles in scope.
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const { current, push, pop, reset } = useMenuStack()

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <nav aria-label="Main navigation" className={styles.root} ref={setPortalContainer}>
        <div className={`${styles.bar} ${styles.mobileBar}`}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className={styles.mobileIconButton}
              aria-label={open ? "Fermer le menu" : triggerLabel}
            >
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </Dialog.Trigger>

          <a href={logoHref} className={styles.mobileLogo} aria-label="LCL Pro home">
            <Logo />
          </a>

          <button type="button" className={styles.mobileIconButton} aria-label="Espace client">
            <UserIcon />
          </button>
        </div>
      </nav>

      <Dialog.Portal container={portalContainer}>
        <Dialog.Overlay className={styles.mobileOverlay} />
        <Dialog.Content className={styles.mobileShell} aria-label="Main navigation">
          <Dialog.Title className={styles.srOnly}>Navigation</Dialog.Title>

          <div className={styles.mobileBody}>
            <div className={styles.mobileScreen}>
              {current.kind === "root" ? (
                <MenuStackScreen
                  kind="root"
                  topBarLinks={topBarLinks}
                  menu={menu}
                  secondaryLinks={[
                    { label: "Simulateurs et devis", href: "#" },
                    { label: "Le Mag", href: "#" },
                    { label: "Découvrir LCL", href: "#" },
                  ]}
                  onPushEntry={(entry) => push({ kind: "entry", entry })}
                />
              ) : current.kind === "entry" ? (
                <MenuStackScreen
                  kind="entry"
                  entry={current.entry}
                  onBack={pop}
                  onPushTab={(tab) => push({ kind: "tab", entry: current.entry, tab })}
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
            <a className={styles.cta} href={ctaHref}>
              {ctaLabel}
            </a>
            <a
              className={styles.topBarLink}
              href="#"
              style={{ color: "var(--_swatch---swatch--brand-blue-600)" }}
            >
              <ChatBubbleIcon />
              Nous contacter
            </a>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 15.5a6.5 6.5 0 0 1 13 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
function ChatBubbleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7l-3 3v-3H4a2 2 0 0 1-2-2V4z" />
    </svg>
  )
}
export default NavigationMenuMobile
